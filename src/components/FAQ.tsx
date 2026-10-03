import Reveal from './Reveal';

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
    a: 'Yes, and lossless mode is free too. The free tier handles up to 20 images per batch at 25 MB each across JPG, PNG, WebP and AVIF. Pro ($39 one-time, lifetime) removes the batch limit, raises the size cap to 200 MB, and adds JXL encoding and EXIF preservation.',
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
    a: 'JPEG XL (JXL) is a next-generation image format designed for high-fidelity compression and lossless recompression of existing JPEGs. Its encoder bundle is large (~3 MB of WASM), so we gate it behind Pro to keep the free experience fast. Lossless mode itself is free — it works with PNG, WebP and AVIF.',
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
  return (
    <section id="faq" className="border-t border-ink-700/80">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-28 pt-24 sm:px-8 sm:pt-32 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone-600">FAQ</p>
            <h2 className="mt-5 text-[clamp(2.25rem,4.6vw,4rem)] font-medium leading-[0.98] tracking-[-0.04em]">
              Frequently <span className="font-serif font-normal italic text-bone-300">asked</span>
            </h2>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-bone-500">
              Something else? <a href="mailto:hello@getcompressly.com" className="text-bone-100 underline decoration-ink-500 underline-offset-4 transition hover:decoration-accent-500">hello@getcompressly.com</a>
            </p>
          </div>
        </Reveal>

        {/* Every answer is visible: no accordion to hunt through, and crawlers see it all. */}
        <dl className="divide-y divide-ink-700 border-y border-ink-700 lg:col-span-8">
          {QA.map((item, i) => (
            <Reveal key={item.q} delay={Math.min(i, 3) * 60} className="group relative py-8 sm:pl-16">
              <dt className="text-lg font-medium tracking-[-0.02em] text-bone-100">
                <span aria-hidden className="tabular mb-3 block font-mono text-xs text-bone-600 transition-colors group-hover:text-accent-500 sm:absolute sm:left-0 sm:top-9 sm:mb-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item.q}
              </dt>
              <dd className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-bone-500">{item.a}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
