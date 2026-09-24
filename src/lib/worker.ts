/// <reference lib="webworker" />
import * as Comlink from 'comlink';
import type { Format, JobInput, JobResult } from '../types';
import { FORMAT_EXT, detectFormat } from '../types';

async function decode(buffer: ArrayBuffer, fmt: Format): Promise<ImageData> {
  let result: ImageData | null = null;
  switch (fmt) {
    case 'jpeg': {
      const m = await import('@jsquash/jpeg');
      result = await m.decode(buffer);
      break;
    }
    case 'png': {
      const m = await import('@jsquash/png');
      result = await m.decode(buffer);
      break;
    }
    case 'webp': {
      const m = await import('@jsquash/webp');
      result = await m.decode(buffer);
      break;
    }
    case 'avif': {
      const m = await import('@jsquash/avif');
      result = await m.decode(buffer);
      break;
    }
    case 'jxl': {
      const m = await import('@jsquash/jxl');
      result = await m.decode(buffer) as ImageData;
      break;
    }
  }
  if (!result) throw new Error(`Decoder returned no data for ${fmt}`);
  return result;
}

// Effort (0-9 in the UI) mapped onto each encoder's own scale.
// OxiPNG levels above 4 cost a lot of time for very little extra saving.
function effortToOxipngLevel(effort: number): number {
  if (effort <= 2) return 1;
  if (effort <= 4) return 2;
  if (effort <= 6) return 3;
  return 4;
}

// MozJPEG repeats its trellis search; more loops squeeze out slightly more at a
// roughly linear time cost. One is the library default.
function effortToTrellisLoops(effort: number): number {
  if (effort <= 2) return 1;
  if (effort <= 5) return 2;
  return 3;
}

// JPEG has no alpha channel and MozJPEG simply ignores it, so a transparent
// pixel keeps whatever RGB it happens to carry — usually black. Composite onto
// white first, which is what people expect a cut-out product shot to become.
function flattenOnWhite(img: ImageData): ImageData {
  const src = img.data;
  let opaque = true;
  for (let i = 3; i < src.length; i += 4) {
    if (src[i] !== 255) { opaque = false; break; }
  }
  if (opaque) return img;
  const out = new Uint8ClampedArray(src.length);
  for (let i = 0; i < src.length; i += 4) {
    const a = src[i + 3] / 255;
    out[i] = src[i] * a + 255 * (1 - a);
    out[i + 1] = src[i + 1] * a + 255 * (1 - a);
    out[i + 2] = src[i + 2] * a + 255 * (1 - a);
    out[i + 3] = 255;
  }
  return new ImageData(out, img.width, img.height);
}

async function encode(img: ImageData, fmt: Format, quality: number, lossless: boolean, effort: number): Promise<ArrayBuffer> {
  switch (fmt) {
    case 'jpeg': {
      img = flattenOnWhite(img);
      const m = await import('@jsquash/jpeg');
      // jSquash already defaults to progressive + optimize_coding, so those are
      // not ours to switch on. Trellis quantisation is the remaining knob, and
      // measuring it showed files getting *larger* at a fixed quality number —
      // it is a rate-distortion optimiser, spending bytes on fidelity rather
      // than saving them. Wrong trade for a compressor's default, so it is
      // reserved for the high end of the effort slider.
      const trellis = effort >= 7
        ? {
            trellis_multipass: true,
            trellis_opt_zero: true,
            trellis_opt_table: true,
            trellis_loops: effortToTrellisLoops(effort),
          }
        : {};
      return await m.encode(img, { quality, auto_subsample: true, ...trellis });
    }
    case 'png': {
      // @jsquash/png only *writes* a PNG — it performs no optimisation, which is
      // why re-encoding an already-saved PNG returned the same or larger bytes.
      // OxiPNG does the real work: it retries every filter and deflate strategy
      // and keeps the smallest valid result. Always lossless.
      const [png, oxi] = await Promise.all([
        import('@jsquash/png'),
        import('@jsquash/oxipng'),
      ]);
      const raw = await png.encode(img);
      return await oxi.optimise(raw, {
        level: effortToOxipngLevel(effort),
        interlace: false,
        // Fully transparent pixels can be rewritten to one colour: invisible,
        // and it compresses far better.
        optimiseAlpha: true,
      });
    }
    case 'webp': {
      const m = await import('@jsquash/webp');
      return await m.encode(img, lossless
        ? { lossless: 1, quality, method: 6 }
        : { quality, method: 6 });
    }
    case 'avif': {
      const m = await import('@jsquash/avif');
      return await m.encode(img, { quality: lossless ? 100 : quality, speed: 11 - effort, chromaDeltaQ: true });
    }
    case 'jxl': {
      const m = await import('@jsquash/jxl');
      return await m.encode(img, lossless
        ? { lossless: true, effort }
        : { quality, effort });
    }
  }
}

async function maybeResize(img: ImageData, mode: 'none' | 'longest' | 'width' | 'height', value: number): Promise<ImageData> {
  if (mode === 'none' || !value) return img;
  const m = await import('@jsquash/resize');
  let targetW = img.width;
  let targetH = img.height;
  if (mode === 'longest') {
    const ratio = value / Math.max(img.width, img.height);
    if (ratio >= 1) return img;
    targetW = Math.round(img.width * ratio);
    targetH = Math.round(img.height * ratio);
  } else if (mode === 'width') {
    if (value >= img.width) return img;
    targetW = value;
    targetH = Math.round((value / img.width) * img.height);
  } else if (mode === 'height') {
    if (value >= img.height) return img;
    targetH = value;
    targetW = Math.round((value / img.height) * img.width);
  }
  return await m.default(img, { width: targetW, height: targetH, method: 'lanczos3', premultiply: true, linearRGB: true });
}

async function compress(job: JobInput): Promise<JobResult> {
  const start = performance.now();
  const inFmt = detectFormat(job.originalType, job.name);
  if (!inFmt) throw new Error(`Unsupported input format: ${job.name}`);

  const outFmt: Format = job.settings.format === 'keep' ? inFmt : job.settings.format;

  const resized = job.settings.resize.mode !== 'none' && !!job.settings.resize.value;
  let img = await decode(job.buffer, inFmt);
  img = await maybeResize(img, job.settings.resize.mode, job.settings.resize.value);
  let outBuffer = await encode(img, outFmt, job.settings.quality, job.settings.lossless, job.settings.effort);
  let outSize = outBuffer.byteLength;

  // Never hand back a file bigger than the original. Re-encoding to the same format
  // without resizing — e.g. "keep original" on an already-optimized PNG, where our
  // lossless encoder can't beat the source — can inflate the file. In that case keep
  // the original bytes so the download is never worse than what the user started with.
  if (!resized && outFmt === inFmt && outSize >= job.originalSize) {
    outBuffer = job.buffer;
    outSize = job.originalSize;
  }

  const base = job.name.replace(/\.[^./\\]+$/, '');
  const outName = `${base}.${FORMAT_EXT[outFmt]}`;

  return Comlink.transfer({
    id: job.id,
    outName,
    outFormat: outFmt,
    outSize,
    outBuffer,
    durationMs: Math.round(performance.now() - start),
  }, [outBuffer]);
}

const api = { compress };
export type CompressorApi = typeof api;
Comlink.expose(api);
