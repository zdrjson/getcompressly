import Reveal from './Reveal';

const ITEMS = [
  {
    title: 'Real batch, not one-at-a-time',
    desc: 'Drag a folder of 200 images and walk away. We fan out across up to four Web Workers in parallel and queue the rest.',
  },
  {
    title: 'Every modern format',
    desc: 'JPG, PNG, WebP, AVIF and JXL — all decode-and-encode in any direction. Convert a folder of PNGs to AVIF in one pass.',
  },
  {
    title: 'Quality you can dial',
    desc: 'Quality slider, lossless mode and encoder effort — all free. The same knobs the pros use, surfaced cleanly.',
  },
  {
    title: 'Powered by the best',
    desc: 'MozJPEG, OxiPNG, libwebp, libavif and libjxl — the exact same encoders behind Google Squoosh, compiled to WASM.',
  },
  {
    title: 'Resize on the way out',
    desc: 'Set a longest side, width or height and every image is downscaled with a Lanczos filter before encoding — one pass, no separate tool.',
  },
];

const STEPS = [
  { k: 'Drop', v: 'Files load into memory', t: 'File API' },
  { k: 'Decode', v: 'Pixels, in a worker', t: 'WASM' },
  { k: 'Encode', v: 'Your format, your quality', t: 'Codec' },
  { k: 'Save', v: 'One file or a ZIP', t: 'Blob' },
];

export default function Features() {
  return (
    <section id="features" className="relative border-t border-ink-700/80">
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-24 sm:px-8 sm:pt-32">
        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone-600">How it works</p>
            <h2 className="mt-5 text-balance text-[clamp(2.25rem,4.6vw,4rem)] font-medium leading-[0.98] tracking-[-0.04em]">
              Built for people who ship images{' '}
              <span className="font-serif font-normal italic text-bone-300">all day.</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="self-end lg:col-span-4 lg:col-start-9">
            <p className="text-pretty leading-relaxed text-bone-300">
              E-commerce stores, content teams, indie devs. If you push hundreds of images a week, the difference between
              &ldquo;cloud uploader&rdquo; and &ldquo;runs locally&rdquo; is your afternoon.
            </p>
          </Reveal>
        </div>

        {/* Pipeline */}
        <Reveal className="mt-16 sm:mt-20">
          <ol className="grid grid-cols-2 overflow-hidden rounded-[28px] border border-ink-700 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li
                key={s.k}
                className="relative border-ink-700 bg-ink-800/30 p-5 sm:p-7 [&:nth-child(-n+2)]:border-b [&:nth-child(odd)]:border-r lg:[&:nth-child(-n+2)]:border-b-0 lg:[&:not(:last-child)]:border-r"
              >
                <div className="flex items-baseline justify-between">
                  <span className="tabular font-mono text-xs text-bone-600">0{i + 1}</span>
                  <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-bone-600 sm:inline">{s.t}</span>
                </div>
                <div className="mt-6 text-xl font-medium tracking-[-0.03em] sm:mt-10 sm:text-2xl">{s.k}</div>
                <div className="mt-1 text-sm text-bone-500">{s.v}</div>
                {i < STEPS.length - 1 && (
                  <span aria-hidden className="absolute -right-[7px] top-1/2 z-10 hidden h-3.5 w-3.5 -translate-y-1/2 rotate-45 border-r border-t border-ink-600 bg-ink-900 lg:block" />
                )}
              </li>
            ))}
          </ol>
        </Reveal>

        {/* Proof + list */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <NetworkProof />
          </Reveal>

          <Reveal delay={100} className="lg:col-span-7">
            <ul className="divide-y divide-ink-700 rounded-[28px] border border-ink-700 bg-ink-800/30 px-6 sm:px-8">
              {ITEMS.map((it, i) => (
                <li key={it.title} className="group grid gap-2 py-6 sm:grid-cols-[3rem_1fr] sm:gap-4">
                  <span className="tabular pt-1 font-mono text-xs text-bone-600 transition-colors group-hover:text-accent-500">
                    {String(i + 2).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-lg font-medium tracking-[-0.02em] text-bone-100">{it.title}</h3>
                    <p className="mt-1.5 max-w-[52ch] text-sm leading-relaxed text-bone-500">{it.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Versus */}
        <Reveal className="mt-6">
          <div className="overflow-x-auto rounded-[28px] border border-ink-700">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="sr-only">How Compressly compares with TinyPNG and Squoosh</caption>
              <thead>
                <tr className="border-b border-ink-700 font-mono text-[11px] uppercase tracking-[0.14em] text-bone-500">
                  <th scope="col" className="px-6 py-4 font-normal sm:px-8" />
                  <th scope="col" className="bg-accent-500/[0.06] px-6 py-4 font-normal text-accent-400">Compressly</th>
                  <th scope="col" className="px-6 py-4 font-normal">TinyPNG</th>
                  <th scope="col" className="px-6 py-4 font-normal">Squoosh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-700">
                <Row label="Files stay on your device" cells={[true, false, true]} />
                <Row label="Many images in one go" cells={[true, true, false]} />
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Row({ label, cells }: { label: string; cells: boolean[] }) {
  return (
    <tr>
      <th scope="row" className="px-6 py-5 font-normal text-bone-300 sm:px-8">{label}</th>
      {cells.map((ok, i) => (
        <td key={i} className={`px-6 py-5 ${i === 0 ? 'bg-accent-500/[0.06]' : ''}`}>
          {ok ? (
            <span className={`inline-flex items-center gap-2 ${i === 0 ? 'text-accent-400' : 'text-bone-100'}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m5 12 5 5L20 7" /></svg>
              Yes
            </span>
          ) : (
            <span className="text-bone-600">No</span>
          )}
        </td>
      ))}
    </tr>
  );
}

// A DevTools-style Network panel, because "verify it yourself" is a stronger
// claim than any shield icon.
function NetworkProof() {
  return (
    <div className="flex h-full flex-col rounded-[28px] border border-ink-700 bg-ink-950/60 p-6 sm:p-8">
      <span className="tabular font-mono text-xs text-bone-600">01</span>
      <h3 className="mt-4 text-2xl font-medium tracking-[-0.03em]">Zero upload, zero risk</h3>
      <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-bone-500">
        Compression happens locally in your browser using WebAssembly. Your files never leave your device — verify it in
        the Network tab.
      </p>

      <div className="mt-8 flex flex-1 flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-900 font-mono text-[11px]" aria-hidden>
        <div className="flex items-center gap-4 border-b border-ink-700 px-4 py-2.5 text-bone-500">
          <span className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-ink-600" />
            <span className="h-2 w-2 rounded-full bg-ink-600" />
            <span className="h-2 w-2 rounded-full bg-ink-600" />
          </span>
          <span className="text-bone-300">Network</span>
          <span>Fetch/XHR</span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" /> Recording
          </span>
        </div>
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 border-b border-ink-700 px-4 py-2 text-bone-600">
          <span>Name</span><span>Method</span><span>Size</span>
        </div>
        <div className="grid min-h-28 flex-1 place-items-center px-4 py-8 text-center text-bone-500">
          <div>
            <div className="font-sans text-sm text-bone-300">No requests while compressing</div>
            <div className="mt-1">Drop 48 photos · encode · download</div>
          </div>
        </div>
        <div className="tabular flex gap-4 border-t border-ink-700 px-4 py-2.5 text-bone-500">
          <span><span className="text-accent-400">0</span> requests</span>
          <span><span className="text-accent-400">0 B</span> transferred</span>
        </div>
      </div>
    </div>
  );
}
