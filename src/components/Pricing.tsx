import Reveal from './Reveal';

interface Props { isPro: boolean; onOpenLicense: () => void }

// Replace with your real Lemon Squeezy store URL after creating the product.
// Recommended: enable LS Overlay Checkout for inline UX.
const LS_CHECKOUT_URL = (import.meta.env.VITE_LS_CHECKOUT_URL as string) || 'https://YOUR-STORE.lemonsqueezy.com/buy/REPLACE_PRODUCT_ID';

const FREE = [
  'Up to 20 files per batch',
  'Lossless mode (PNG/WebP/AVIF)',
  'Max 25 MB per file',
  'JPG · PNG · WebP · AVIF',
  'Quality slider + resize',
  'ZIP download',
  '100% local processing',
];

const PRO = [
  'Unlimited batch size',
  'Max 200 MB per file',
  'JXL encoding + decoding',
  'EXIF metadata preservation',
  'Advanced encoder controls (effort, chroma)',
  'Priority support · lifetime updates',
  'Use on unlimited devices',
];

export default function Pricing({ isPro, onOpenLicense }: Props) {
  return (
    <section id="pricing" className="border-t border-ink-700/80">
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-24 sm:px-8 sm:pt-32">
        <Reveal className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone-600">Pricing</p>
          <h2 className="mt-5 text-balance text-[clamp(2.25rem,4.6vw,4rem)] font-medium leading-[0.98] tracking-[-0.04em]">
            One price. Lifetime.{' '}
            <span className="font-serif font-normal italic text-bone-300">No subscription.</span>
          </h2>
          <p className="mt-6 max-w-xl text-pretty leading-relaxed text-bone-300">
            Buy once, use forever. Every future update included. Refund if it doesn&apos;t earn you back the price in saved time.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="flex h-full flex-col rounded-[28px] border border-ink-700 bg-ink-800/30 p-7 sm:p-9">
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-medium">Free</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-bone-600">No signup</span>
              </div>
              <div className="mt-8 flex items-baseline gap-2">
                <span className="tabular text-6xl font-medium tracking-[-0.05em]">$0</span>
                <span className="text-bone-500">/ forever</span>
              </div>
              <p className="mt-3 text-sm text-bone-500">For the occasional batch. No signup needed.</p>
              <ul className="mb-10 mt-8 space-y-3">
                {FREE.map((f) => <Tick key={f} text={f} />)}
              </ul>
              <a href="#tool" className="mt-auto inline-flex w-full justify-center rounded-full border border-ink-500 px-4 py-3 text-sm font-medium text-bone-100 transition hover:border-bone-300 active:scale-[0.98]">
                Start free
              </a>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-7">
            <div className="relative isolate flex h-full flex-col overflow-hidden rounded-[28px] border border-accent-500/40 bg-ink-800/60 p-7 sm:p-9">
              <div aria-hidden className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-accent-500/[0.12] blur-3xl" />
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-medium text-accent-400">Pro</span>
                <span className="rounded-[5px] bg-accent-500 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-950">Pro · Lifetime</span>
              </div>
              <div className="mt-8 flex items-baseline gap-2">
                <span className="tabular font-serif text-8xl leading-none tracking-[-0.03em] text-bone-100">$39</span>
                <span className="text-bone-500">/ one-time</span>
              </div>
              <p className="mt-3 text-sm text-bone-500">For people who push images every day.</p>
              <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {PRO.map((f) => <Tick key={f} text={f} accent />)}
              </ul>
              <div className="mt-10 lg:mt-auto lg:pt-10">
                {isPro ? (
                  <div className="inline-flex w-full justify-center rounded-full bg-accent-500/15 px-4 py-3 text-sm font-medium text-accent-400 ring-1 ring-inset ring-accent-500/30">
                    ✓ Activated on this device
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <a
                      href={LS_CHECKOUT_URL}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex flex-1 justify-center rounded-full bg-accent-500 px-5 py-3 text-sm font-medium text-ink-950 transition hover:bg-accent-400 active:scale-[0.98]"
                    >
                      Get Pro — $39
                    </a>
                    <button onClick={onOpenLicense} className="px-3 py-2 text-sm text-bone-300 transition-colors hover:text-bone-100">
                      Already purchased? Enter your license →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>

        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.12em] text-bone-600">
          Payments processed by Lemon Squeezy · 14-day money-back guarantee · VAT/tax handled automatically
        </p>
      </div>
    </section>
  );
}

function Tick({ text, accent = false }: { text: string; accent?: boolean }) {
  return (
    <li className="flex items-start gap-3 text-sm text-bone-300">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent ? '#b6f36a' : 'currentColor'} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-bone-600" aria-hidden>
        <path d="m5 12 5 5L20 7"/>
      </svg>
      <span>{text}</span>
    </li>
  );
}
