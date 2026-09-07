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

async function encode(img: ImageData, fmt: Format, quality: number, lossless: boolean, effort: number): Promise<ArrayBuffer> {
  switch (fmt) {
    case 'jpeg': {
      const m = await import('@jsquash/jpeg');
      return await m.encode(img, { quality });
    }
    case 'png': {
      const m = await import('@jsquash/png');
      return await m.encode(img);
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
