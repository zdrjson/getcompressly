import { useState } from 'react';

const QA = [
  {
    q: 'How does Compressly compress images?',
    a: 'Compressly uses the open-source MozJPEG (Mozilla), OxiPNG, libwebp (Google), libavif (AOMedia) and libjxl encoders compiled to WebAssembly — the same codec family as Google\'s Squoosh. All compression runs locally inside your browser; your files never touch a server.',
  },
  {
    q: 'Which image formats are supported?',
    a: 'JPG, PNG, WebP, AVIF and JXL — for both decoding and encoding. You can convert freely between any of them in a single pass.',
  },
  {
    q: 'Is Compressly really free?',
    a: 'Yes. The free tier handles up to 20 images per batch at 25 MB each with the four mainstream formats. Pro ($39 one-time, lifetime) removes the batch limit, raises the size cap to 200 MB, unlocks JXL encoding, lossless mode and EXIF preservation.',
  },
  {
    q: 'Are my images uploaded anywhere?',
    a: 'No. Compressly is a static client-side app — there is no server upload step. Open DevTools → Network tab while compressing to verify nothing is sent.',
  },
  {
    q: 'How does Compressly differ from TinyPNG or Squoosh?',
    a: 'TinyPNG compresses on its servers, so your files are uploaded. Squoosh runs locally but works one image at a time. Compressly stays local like Squoosh and adds true batch processing, ZIP export and a one-time Pro license for power users.',
  },
  {
    q: 'What is JXL and why does Pro require it?',
    a: 'JPEG XL (JXL) is a next-generation image format designed for high-fidelity compression and lossless recompression of existing JPEGs. Its encoder bundle is large (~3 MB of WASM), so we gate it behind Pro to keep the free experience fast.',
  },
  {
    q: 'Does Pro work across browsers and devices?',
    a: 'Yes. Your license unlocks Compressly on every browser and device you use it on — no seat limit. Just paste the key into "Have a key?" at the top.',
  },
  {
    q: 'What\'s your refund policy?',
    a: 'Lemon Squeezy handles billing with a 14-day money-back guarantee, no questions asked. Just reply to your purchase receipt.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-t border-ink-700 bg-ink-900/50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">Frequently asked</h2>
        <div className="mt-10 space-y-2">
          {QA.map((item, i) => (
            <div key={item.q} className="rounded-xl border border-ink-700 bg-ink-800/40">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-4 text-left"
              >
                <span className="font-medium text-zinc-100">{item.q}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 text-zinc-500 transition ${open === i ? 'rotate-180' : ''}`}>
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              {/* Always in the DOM (toggled with `hidden`) so crawlers see every answer, not just the open one. */}
              <div
                hidden={open !== i}
                className="border-t border-ink-700 px-4 pb-4 pt-3 text-sm text-zinc-400 leading-relaxed"
              >
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
