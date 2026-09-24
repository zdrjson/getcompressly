// First-party compression benchmark.
//
// Runs the exact jSquash encoders the site ships, at the site's default
// settings (quality 75, effort 4 — see src/lib/worker.ts and DEFAULT_SETTINGS
// in src/types.ts), over the fixed image set in bench/corpus/. Every output is
// decoded again and scored against the source with SSIM, so a byte count never
// appears without the quality it bought.
//
//   npm run benchmark   → prints a table, writes public/benchmark.json and
//                         regenerates the tables in pages/benchmark.html
//
// The baseline is each image saved as a plain, unoptimised PNG — what an image
// editor or screenshot tool typically writes. It is re-encoded here rather than
// read from disk, so the committed files can stay losslessly squeezed.
//
// Output sizes are deterministic for a given codec version; timings are not,
// so none are recorded.

import { existsSync, readFileSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(root, 'package.json'));
const pkgDir = (name) => dirname(require.resolve(`${name}/package.json`));

// Emscripten's glue tries to fetch() its .wasm by file URL, which Node refuses.
// Compile each module ourselves and hand it to the codec's init().
async function wasm(name, file) {
  return WebAssembly.compile(await readFile(join(pkgDir(name), file)));
}

async function loadCodecs() {
  const [jpegDec, jpegEnc, pngDec, pngEnc, webpDec, webpEnc, avifDec, avifEnc, oxi, resize] = await Promise.all([
    import('@jsquash/jpeg/decode.js'),
    import('@jsquash/jpeg/encode.js'),
    import('@jsquash/png/decode.js'),
    import('@jsquash/png/encode.js'),
    import('@jsquash/webp/decode.js'),
    import('@jsquash/webp/encode.js'),
    import('@jsquash/avif/decode.js'),
    import('@jsquash/avif/encode.js'),
    import('@jsquash/oxipng/optimise.js'),
    import('@jsquash/resize'),
  ]);
  await Promise.all([
    jpegDec.init(await wasm('@jsquash/jpeg', 'codec/dec/mozjpeg_dec.wasm')),
    jpegEnc.init(await wasm('@jsquash/jpeg', 'codec/enc/mozjpeg_enc.wasm')),
    pngDec.init(await wasm('@jsquash/png', 'codec/pkg/squoosh_png_bg.wasm')),
    pngEnc.init(await wasm('@jsquash/png', 'codec/pkg/squoosh_png_bg.wasm')),
    webpDec.init(await wasm('@jsquash/webp', 'codec/dec/webp_dec.wasm')),
    // Node always passes jSquash's SIMD feature check, so it loads this build.
    webpEnc.init(await wasm('@jsquash/webp', 'codec/enc/webp_enc_simd.wasm')),
    avifDec.init(await wasm('@jsquash/avif', 'codec/dec/avif_dec.wasm')),
    avifEnc.init(await wasm('@jsquash/avif', 'codec/enc/avif_enc.wasm')),
    oxi.init(await wasm('@jsquash/oxipng', 'codec/pkg/squoosh_oxipng_bg.wasm')),
    resize.initResize(await wasm('@jsquash/resize', 'lib/resize/pkg/squoosh_resize_bg.wasm')),
  ]);
  return { jpegDec, jpegEnc, pngDec, pngEnc, webpDec, webpEnc, avifDec, avifEnc, oxi, resize };
}

// Mirrors src/lib/worker.ts encode() at DEFAULT_SETTINGS. Keep the two in step.
const QUALITY = 75;
const EFFORT = 4;

function targets(c) {
  return [
    {
      id: 'png-oxipng',
      label: 'PNG (OxiPNG, lossless)',
      encodeAt: async (img) => c.oxi.default(await c.pngEnc.default(img), { level: 2, interlace: false, optimiseAlpha: true }),
      decode: (buf) => c.pngDec.default(buf),
    },
    {
      id: 'jpeg',
      label: `JPEG (MozJPEG q${QUALITY})`,
      // Flattened onto white first, exactly as the app does before MozJPEG.
      encodeAt: (img, quality) => c.jpegEnc.default(flattenOnWhite(img), { quality, auto_subsample: true }),
      decode: (buf) => c.jpegDec.default(buf),
    },
    {
      id: 'webp',
      label: `WebP (q${QUALITY})`,
      encodeAt: (img, quality) => c.webpEnc.default(img, { quality, method: 6 }),
      decode: (buf) => c.webpDec.default(buf),
    },
    {
      id: 'webp-lossless',
      label: 'WebP (lossless)',
      encodeAt: (img) => c.webpEnc.default(img, { lossless: 1, quality: QUALITY, method: 6 }),
      decode: (buf) => c.webpDec.default(buf),
    },
    {
      id: 'avif',
      label: `AVIF (q${QUALITY})`,
      encodeAt: (img, quality) => c.avifEnc.default(img, { quality, speed: 11 - EFFORT, chromaDeltaQ: true }),
      decode: (buf) => c.avifDec.default(buf),
    },
  ];
}

// Same compositing as flattenOnWhite() in src/lib/worker.ts. Node has no
// ImageData, and jSquash only reads data/width/height, so a plain object does.
function flattenOnWhite(img) {
  const src = img.data;
  const out = new Uint8ClampedArray(src.length);
  for (let i = 0; i < src.length; i += 4) {
    const a = src[i + 3] / 255;
    out[i] = src[i] * a + 255 * (1 - a);
    out[i + 1] = src[i + 1] * a + 255 * (1 - a);
    out[i + 2] = src[i + 2] * a + 255 * (1 - a);
    out[i + 3] = 255;
  }
  return { data: out, width: img.width, height: img.height };
}

// SSIM on BT.601 luma, 8×8 windows at stride 4 (the Wang et al. constants).
// Pixels are composited over white first, so transparent regions compare the
// way they display on a typical page.
function luma(img) {
  const { data, width, height } = img;
  const out = new Float64Array(width * height);
  for (let i = 0, p = 0; p < out.length; i += 4, p++) {
    const a = data[i + 3] / 255;
    const r = data[i] * a + 255 * (1 - a);
    const g = data[i + 1] * a + 255 * (1 - a);
    const b = data[i + 2] * a + 255 * (1 - a);
    out[p] = 0.299 * r + 0.587 * g + 0.114 * b;
  }
  return out;
}

function ssim(a, b, width, height) {
  const C1 = (0.01 * 255) ** 2;
  const C2 = (0.03 * 255) ** 2;
  const W = 8;
  let sum = 0;
  let n = 0;
  for (let y = 0; y + W <= height; y += 4) {
    for (let x = 0; x + W <= width; x += 4) {
      let ma = 0, mb = 0;
      for (let j = 0; j < W; j++) for (let i = 0; i < W; i++) {
        const k = (y + j) * width + x + i;
        ma += a[k]; mb += b[k];
      }
      ma /= W * W; mb /= W * W;
      let va = 0, vb = 0, cov = 0;
      for (let j = 0; j < W; j++) for (let i = 0; i < W; i++) {
        const k = (y + j) * width + x + i;
        const da = a[k] - ma, db = b[k] - mb;
        va += da * da; vb += db * db; cov += da * db;
      }
      va /= W * W - 1; vb /= W * W - 1; cov /= W * W - 1;
      sum += ((2 * ma * mb + C1) * (2 * cov + C2)) / ((ma * ma + mb * mb + C1) * (va + vb + C2));
      n++;
    }
  }
  return sum / n;
}

function hasAlpha(img) {
  for (let i = 3; i < img.data.length; i += 4) if (img.data[i] !== 255) return true;
  return false;
}

const toArrayBuffer = (b) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
const pixelHash = (img) => createHash('sha256').update(img.data).digest('hex');

// Photos are too heavy to commit, so they are fetched from their public source
// and normalised the same way every time: MozJPEG decode, then the app's own
// lanczos3 resize. The pixel hash in manifest.json proves the result matches.
async function prepare(c, entry, path) {
  if (!entry.source?.endsWith('.jpg')) throw new Error(`${entry.file} is missing and has no fetchable source`);
  console.log(`Fetching ${entry.source}`);
  const res = await fetch(entry.source);
  if (!res.ok) throw new Error(`${entry.source} → HTTP ${res.status}`);
  let img = await c.jpegDec.default(await res.arrayBuffer());
  const r = entry.resizeLongest / Math.max(img.width, img.height);
  if (r < 1) {
    img = await c.resize.default(img, {
      width: Math.round(img.width * r),
      height: Math.round(img.height * r),
      method: 'lanczos3',
      premultiply: true,
      linearRGB: true,
    });
  }
  await writeFile(path, Buffer.from(await c.pngEnc.default(img)));
}

// Quality numbers mean different things to different encoders, so "q75 vs q75"
// is not a fair fight. The fair question is: what does each format cost to
// look as good as a reference? Binary-search the lowest quality whose SSIM
// reaches the target. SSIM rises with quality closely enough for this; the
// result is the smallest setting that meets the bar, not an interpolation.
async function cheapestAtSsim(t, img, ref, target) {
  let lo = 1, hi = 100, best = null;
  while (lo <= hi) {
    const q = (lo + hi) >> 1;
    const out = await t.encodeAt(img, q);
    const score = ssim(ref, luma(await t.decode(out)), img.width, img.height);
    if (score >= target) {
      best = { quality: q, bytes: out.byteLength, ssim: Number(score.toFixed(4)) };
      hi = q - 1;
    } else {
      lo = q + 1;
    }
  }
  return best;
}

// The page's tables are generated so they can never disagree with the JSON.
// Everything between <!-- bench:NAME --> and <!-- /bench:NAME --> is replaced.
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const kbCell = (n) => `${Math.round(n / 1024).toLocaleString('en-US')} KB`;

async function renderPage(path, result, manifest) {
  const describe = Object.fromEntries(manifest.images.map((m) => [m.file, m]));
  const cols = ['png-oxipng', 'webp-lossless', 'jpeg', 'webp', 'avif'];
  const short = { 'png-oxipng': 'OxiPNG', 'webp-lossless': 'WebP lossless', jpeg: 'MozJPEG q75', webp: 'WebP q75', avif: 'AVIF q75' };
  const sizes = [
    '<div class="table-scroll"><table class="cmp data">',
    '<thead><tr><th>Image</th><th>PNG, unoptimised</th>' +
      cols.map((id) => `<th>${esc(short[id])}</th>`).join('') +
      '</tr></thead><tbody>',
    ...result.images.map((r) =>
      `<tr><td>${esc(describe[r.file].description.split(' — ')[0])}<span class="dim">${r.width}×${r.height}</span></td>` +
        `<td>${kbCell(r.sourceBytes)}</td>` +
        cols.map((id) => {
          const o = r.outputs[id];
          const q = o.ssim === 1 ? 'lossless' : `SSIM ${o.ssim.toFixed(3)}`;
          return `<td>${kbCell(o.bytes)}<span class="dim">−${(o.saving * 100).toFixed(0)}%</span><span class="dim">${q}</span></td>`;
        }).join('') +
        '</tr>',
    ),
    '</tbody></table></div>',
  ].join('\n');

  const matched = [
    '<div class="table-scroll"><table class="cmp data">',
    '<thead><tr><th>Image</th><th>MozJPEG q75</th><th>WebP at same SSIM</th><th>AVIF at same SSIM</th></tr></thead><tbody>',
    ...result.images.filter((r) => r.matchedToJpeg).map((r) => {
      const m = r.matchedToJpeg;
      const cell = (x) => (x ? `${kbCell(x.bytes)}<span class="dim">${(x.vsJpeg * 100).toFixed(0)}% smaller</span><span class="dim">at quality ${x.quality}</span>` : 'n/a');
      return `<tr><td>${esc(describe[r.file].description.split(' — ')[0])}</td>` +
        `<td>${kbCell(m.jpegBytes)}<span class="dim">SSIM ${m.targetSsim.toFixed(3)}</span></td><td>${cell(m.webp)}</td><td>${cell(m.avif)}</td></tr>`;
    }),
    '</tbody></table></div>',
  ].join('\n');

  let html = await readFile(path, 'utf8');
  for (const [name, body] of Object.entries({ sizes, matched })) {
    const re = new RegExp(`(<!-- bench:${name} -->)[\\s\\S]*?(<!-- /bench:${name} -->)`);
    if (!re.test(html)) throw new Error(`pages/benchmark.html has no bench:${name} markers`);
    html = html.replace(re, `$1\n${body}\n$2`);
  }
  await writeFile(path, html);
}

const pct = (x) => `${(x * 100).toFixed(1)}%`;
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

async function main() {
  const corpusDir = join(root, 'bench/corpus');
  const manifest = JSON.parse(await readFile(join(corpusDir, 'manifest.json'), 'utf8'));
  const c = await loadCodecs();
  const tgts = targets(c);
  const versions = Object.fromEntries(
    ['@jsquash/jpeg', '@jsquash/png', '@jsquash/oxipng', '@jsquash/webp', '@jsquash/avif'].map((n) => [
      n,
      JSON.parse(readFileSync(join(pkgDir(n), 'package.json'), 'utf8')).version,
    ]),
  );

  const rows = [];
  for (const entry of manifest.images) {
    const path = join(corpusDir, entry.file);
    if (!existsSync(path)) await prepare(c, entry, path);
    const img = await c.pngDec.default(toArrayBuffer(await readFile(path)));
    if (pixelHash(img) !== entry.pixelsSha256) {
      throw new Error(`${entry.file}: pixels do not match manifest.json — delete it to re-fetch, or the source changed`);
    }
    const sourceBytes = (await c.pngEnc.default(img)).byteLength;
    const ref = luma(img);
    const alpha = hasAlpha(img);
    const row = {
      file: entry.file,
      kind: entry.kind,
      width: img.width,
      height: img.height,
      alpha,
      sourceBytes,
      outputs: {},
    };
    for (const t of tgts) {
      const out = await t.encodeAt(img, QUALITY);
      const back = await t.decode(out);
      row.outputs[t.id] = {
        bytes: out.byteLength,
        saving: Number((1 - out.byteLength / sourceBytes).toFixed(4)),
        ssim: Number(ssim(ref, luma(back), img.width, img.height).toFixed(4)),
        ...(t.id === 'jpeg' && alpha ? { flattenedOnWhite: true } : {}),
      };
    }
    const o = row.outputs;
    console.log(
      `${entry.file.padEnd(26)} ${String(img.width + '×' + img.height).padEnd(10)} src ${kb(row.sourceBytes).padStart(8)}` +
        tgts.map((t) => `  ${t.id} ${kb(o[t.id].bytes).padStart(7)} (${pct(o[t.id].saving).padStart(6)}, ssim ${o[t.id].ssim.toFixed(3)})`).join(''),
    );

    // Matched quality: what WebP and AVIF cost to look as good as a q75
    // MozJPEG. Skipped for transparent images: the JPEG has lost its alpha
    // channel, so matching it would compare a different picture.
    if (!alpha) {
      const target = o.jpeg.ssim;
      row.matchedToJpeg = { targetSsim: target, jpegBytes: o.jpeg.bytes };
      for (const t of tgts.filter((t) => t.id === 'webp' || t.id === 'avif')) {
        const m = await cheapestAtSsim(t, img, ref, target);
        row.matchedToJpeg[t.id] = m && { ...m, vsJpeg: Number((1 - m.bytes / o.jpeg.bytes).toFixed(4)) };
      }
      const mt = row.matchedToJpeg;
      console.log(
        `  ↳ matched to JPEG ssim ${target.toFixed(3)}: ` +
          ['webp', 'avif'].map((id) => (mt[id] ? `${id} q${mt[id].quality} ${kb(mt[id].bytes)} (${pct(mt[id].vsJpeg)} vs JPEG)` : `${id} n/a`)).join('  '),
      );
    }
    rows.push(row);
  }

  // Median rather than mean: one flat graphic or one noisy photo should not
  // drag the headline number around.
  const median = (xs) => {
    const s = [...xs].sort((a, b) => a - b);
    const m = s.length >> 1;
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };
  const summary = {};
  for (const t of tgts) {
    const set = (filter) => rows.filter(filter).map((r) => r.outputs[t.id]);
    const all = set(() => true);
    const photos = set((r) => r.kind === 'photo');
    summary[t.id] = {
      label: t.label,
      medianSaving: Number(median(all.map((o) => o.saving)).toFixed(4)),
      medianSavingPhotos: Number(median(photos.map((o) => o.saving)).toFixed(4)),
      medianSsim: Number(median(all.map((o) => o.ssim)).toFixed(4)),
    };
  }
  console.log('\nMedian saving vs. unoptimised PNG (all / photos only), median SSIM:');
  for (const s of Object.values(summary)) {
    console.log(`  ${s.label.padEnd(26)} ${pct(s.medianSaving).padStart(6)} / ${pct(s.medianSavingPhotos).padStart(6)}   ssim ${s.medianSsim.toFixed(3)}`);
  }

  const matched = rows.filter((r) => r.matchedToJpeg);
  const matchedSummary = {};
  for (const id of ['webp', 'avif']) {
    const vs = (filter) => matched.filter(filter).map((r) => r.matchedToJpeg[id]).filter(Boolean).map((m) => m.vsJpeg);
    matchedSummary[id] = {
      medianVsJpeg: Number(median(vs(() => true)).toFixed(4)),
      medianVsJpegPhotos: Number(median(vs((r) => r.kind === 'photo')).toFixed(4)),
      images: vs(() => true).length,
    };
  }
  console.log('\nMedian size vs. q75 MozJPEG at the same SSIM (all opaque / photos only):');
  for (const [id, m] of Object.entries(matchedSummary)) {
    console.log(`  ${id.padEnd(6)} ${pct(m.medianVsJpeg).padStart(6)} smaller / ${pct(m.medianVsJpegPhotos).padStart(6)} smaller   (${m.images} images)`);
  }

  const result = {
    generated: new Date().toISOString().slice(0, 10),
    settings: { quality: QUALITY, effort: EFFORT, note: 'Site defaults; see src/lib/worker.ts' },
    baseline: 'Each image written as an unoptimised PNG by @jsquash/png',
    codecVersions: versions,
    metric: 'SSIM on BT.601 luma after compositing over white; 8x8 windows, stride 4',
    images: rows,
    summary,
    matchedToJpeg: matchedSummary,
  };
  await writeFile(join(root, 'public/benchmark.json'), JSON.stringify(result, null, 2) + '\n');
  await renderPage(join(root, 'pages/benchmark.html'), result, manifest);
  console.log('\nWrote public/benchmark.json and the tables in pages/benchmark.html');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
