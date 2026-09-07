export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-accent-500/15 blur-3xl" />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-800/60 px-3 py-1 text-xs font-medium text-zinc-300">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
          100% browser-based · zero upload
        </div>
        <h1 className="mt-6 text-balance text-4xl sm:text-6xl font-extrabold tracking-tight">
          Compress images
          <span className="text-accent-500"> up to 80% smaller</span>
          <br className="hidden sm:inline" /> without losing what matters.
        </h1>
        <p className="mt-5 text-balance mx-auto max-w-2xl text-base sm:text-lg text-zinc-400">
          JPG · PNG · WebP · AVIF · JXL. Batch-compress and convert between every modern image format with the same open-source codecs as Google&apos;s Squoosh — all running in your browser, nothing uploaded.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#tool" className="inline-flex items-center justify-center rounded-md bg-accent-500 px-5 py-3 text-sm font-semibold text-ink-950 hover:bg-accent-400 transition">
            Start compressing — it&apos;s free
          </a>
          <a href="#pricing" className="px-3 py-3 text-sm text-zinc-300 hover:text-zinc-100">
            See Pro features →
          </a>
        </div>
        <p className="mt-4 text-xs text-zinc-500">
          No signup. No file uploads. No watermark.
        </p>
      </div>
    </section>
  );
}
