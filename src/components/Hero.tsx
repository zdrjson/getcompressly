import Specimen from './Specimen';

const CODECS = ['MozJPEG', 'OxiPNG', 'libwebp', 'libavif', 'libjxl'];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="hairlines absolute inset-0 -z-10" />
      <div aria-hidden className="absolute -top-40 right-[-10%] -z-10 h-[620px] w-[620px] rounded-full bg-accent-500/[0.07] blur-[120px]" />

      <div className="mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pb-24 lg:pt-14">
        <div className="lg:col-span-7">
          <p className="rise flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bone-500" style={{ '--d': '0ms' } as React.CSSProperties}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent-500/60" />
              <span className="relative h-2 w-2 rounded-full bg-accent-500" />
            </span>
            100% browser-based · zero upload
          </p>

          <h1
            className="settle mt-7 text-balance text-[clamp(2.6rem,5.6vw,5.25rem)] font-medium leading-[0.95] tracking-[-0.045em]"
           
          >
            Compress images{' '}
            <span className="font-serif text-[1.08em] font-normal italic tracking-[-0.02em] text-accent-500">up to 80%</span>{' '}
            smaller. <span className="text-bone-500">Nothing leaves your browser.</span>
          </h1>

          <p className="rise mt-7 max-w-[34rem] text-pretty text-base leading-relaxed text-bone-300 sm:text-lg" style={{ '--d': '160ms' } as React.CSSProperties}>
            JPG, PNG, WebP, AVIF and JXL. Batch-compress and convert between every modern image format with the same
            open-source codecs as Google&apos;s Squoosh — running on your own machine, not ours.
          </p>

          <div className="rise mt-9 flex flex-wrap items-center gap-x-6 gap-y-4" style={{ '--d': '240ms' } as React.CSSProperties}>
            <a
              href="#tool"
              className="group inline-flex items-center gap-3 rounded-full bg-accent-500 py-2 pl-6 pr-2 text-[15px] font-medium text-ink-950 transition duration-300 hover:bg-accent-400 active:scale-[0.98]"
            >
              Start compressing — it&apos;s free
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ink-950 text-accent-500 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 5v14M5 12l7 7 7-7" /></svg>
              </span>
            </a>
            <a href="#pricing" className="group text-sm text-bone-300 transition-colors hover:text-bone-100">
              See Pro features{' '}
              <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>

          <p className="rise mt-6 text-xs text-bone-500" style={{ '--d': '300ms' } as React.CSSProperties}>
            No signup. No file uploads. No watermark.
          </p>
        </div>

        <div className="rise mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none" style={{ '--d': '220ms' } as React.CSSProperties}>
          <Specimen />
        </div>
      </div>

      {/* Codec ribbon */}
      <div className="border-y border-ink-700/80 bg-ink-950/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone-600">Compiled to WebAssembly</span>
          <ul className="flex flex-wrap gap-x-7 gap-y-2 font-mono text-[13px] text-bone-300">
            {CODECS.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <span aria-hidden className="h-1 w-1 rounded-full bg-bone-600" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
