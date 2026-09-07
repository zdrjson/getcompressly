interface Props { isPro: boolean; onOpenLicense: () => void }

// Replace with your real Lemon Squeezy store URL after creating the product.
// Recommended: enable LS Overlay Checkout for inline UX.
const LS_CHECKOUT_URL = (import.meta.env.VITE_LS_CHECKOUT_URL as string) || 'https://YOUR-STORE.lemonsqueezy.com/buy/REPLACE_PRODUCT_ID';

const FREE = [
  'Up to 20 files per batch',
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
  'Lossless mode (PNG/WebP/AVIF/JXL)',
  'EXIF metadata preservation',
  'Advanced encoder controls (effort, chroma)',
  'Priority support · lifetime updates',
  'Use on unlimited devices',
];

export default function Pricing({ isPro, onOpenLicense }: Props) {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">One price. Lifetime. No subscription.</h2>
      <p className="mt-3 text-center text-zinc-400 max-w-xl mx-auto">
        Buy once, use forever. Every future update included. Refund if it doesn&apos;t earn you back the price in saved time.
      </p>

      <div className="mt-12 grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
        <div className="rounded-2xl border border-ink-700 bg-ink-800/50 p-7">
          <div className="text-sm font-semibold uppercase tracking-wide text-zinc-400">Free</div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold">$0</span>
            <span className="text-zinc-500">/ forever</span>
          </div>
          <p className="mt-2 text-sm text-zinc-400">For the occasional batch. No signup needed.</p>
          <a href="#tool" className="mt-6 inline-flex w-full justify-center rounded-md border border-ink-600 bg-ink-900 px-4 py-2.5 text-sm font-semibold text-zinc-100 hover:border-ink-500">
            Start free
          </a>
          <ul className="mt-6 space-y-2">
            {FREE.map((f) => <Tick key={f} text={f} />)}
          </ul>
        </div>

        <div className="relative rounded-2xl border-2 border-accent-500 bg-gradient-to-b from-accent-500/10 to-transparent p-7">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-950">
            Pro · Lifetime
          </div>
          <div className="text-sm font-semibold uppercase tracking-wide text-accent-400">Pro</div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold">$39</span>
            <span className="text-zinc-500">/ one-time</span>
          </div>
          <p className="mt-2 text-sm text-zinc-400">For people who push images every day.</p>
          {isPro ? (
            <div className="mt-6 inline-flex w-full justify-center rounded-md bg-accent-500/20 px-4 py-2.5 text-sm font-semibold text-accent-400 ring-1 ring-inset ring-accent-500/30">
              ✓ Activated on this device
            </div>
          ) : (
            <>
              <a
                href={LS_CHECKOUT_URL}
                target="_blank"
                rel="noopener"
                className="mt-6 inline-flex w-full justify-center rounded-md bg-accent-500 px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-accent-400"
              >
                Get Pro — $39
              </a>
              <button onClick={onOpenLicense} className="mt-2 inline-flex w-full justify-center text-xs text-zinc-400 hover:text-zinc-200">
                Already purchased? Enter your license →
              </button>
            </>
          )}
          <ul className="mt-6 space-y-2">
            {PRO.map((f) => <Tick key={f} text={f} accent />)}
          </ul>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-zinc-500">
        Payments processed by Lemon Squeezy · 14-day money-back guarantee · VAT/tax handled automatically
      </p>
    </section>
  );
}

function Tick({ text, accent = false }: { text: string; accent?: boolean }) {
  return (
    <li className="flex items-start gap-2 text-sm text-zinc-300">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent ? '#a3ff5a' : 'currentColor'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
        <path d="m5 12 5 5L20 7"/>
      </svg>
      <span>{text}</span>
    </li>
  );
}
