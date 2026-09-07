const ITEMS = [
  {
    title: 'Zero upload, zero risk',
    desc: 'Compression happens locally in your browser using WebAssembly. Your files never leave your device — verify it in the Network tab.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
    ),
  },
  {
    title: 'Real batch, not one-at-a-time',
    desc: 'Drag a folder of 200 images and walk away. We fan out across up to four Web Workers in parallel and queue the rest.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
    ),
  },
  {
    title: 'Every modern format',
    desc: 'JPG, PNG, WebP, AVIF and JXL — all decode-and-encode in any direction. Convert a folder of PNGs to AVIF in one pass.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8 13 0M3 16l8 8M3 8l8-8M21 16l-8 8"/></svg>
    ),
  },
  {
    title: 'Quality you can dial',
    desc: 'Quality slider, lossless mode, encoder effort, chroma controls. Same knobs the pros use — surfaced cleanly.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M4 6h6M14 6h6M4 18h6M14 18h6M12 4v4M12 16v4"/></svg>
    ),
  },
  {
    title: 'Powered by the best',
    desc: 'MozJPEG, OxiPNG, libwebp, libavif and libjxl — the exact same encoders behind Google Squoosh, compiled to WASM.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></svg>
    ),
  },
  {
    title: 'Resize on the way out',
    desc: 'Set a longest side, width or height and every image is downscaled with a Lanczos filter before encoding — one pass, no separate tool.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 3 14 10M21 3h-6M21 3v6M3 21l7-7M3 21h6M3 21v-6"/></svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="border-y border-ink-700 bg-ink-900/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">Built for people who ship images all day</h2>
        <p className="mt-3 text-center text-zinc-400 max-w-2xl mx-auto">
          E-commerce stores, content teams, indie devs. If you push hundreds of images a week, the difference between &quot;cloud uploader&quot; and &quot;runs locally&quot; is your afternoon.
        </p>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ITEMS.map((it) => (
            <div key={it.title} className="rounded-xl border border-ink-700 bg-ink-800/50 p-5">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/10 text-accent-500 mb-3">
                {it.icon}
              </div>
              <h3 className="font-semibold text-zinc-100">{it.title}</h3>
              <p className="mt-1 text-sm text-zinc-400">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
