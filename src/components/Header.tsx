interface Props { isPro: boolean; onOpenLicense: () => void }

const NAV = [
  { href: '#tool', label: 'Tool' },
  { href: '#features', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

export default function Header({ isPro, onOpenLicense }: Props) {
  // Surface is handled in CSS (.site-header): solid by default, transparent
  // over the very top of the hero where the browser supports scroll timelines.
  return (
    <header className="site-header sticky top-0 z-40 border-b">
      <a href="#tool" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 rounded-md bg-accent-500 px-3 py-2 text-sm font-semibold text-ink-950">
        Skip to the tool
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-8">
        <a href="#" className="group flex shrink-0 items-center gap-2.5 text-[17px] font-semibold tracking-[-0.02em]">
          <Logo />
          <span>Compressly</span>
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-1 text-sm text-bone-300 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="rounded-full px-3.5 py-2 transition-colors duration-300 hover:bg-ink-700/70 hover:text-bone-100">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {isPro ? (
            <button
              onClick={onOpenLicense}
              className="rounded-full border border-accent-500/40 bg-accent-500/10 px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.08em] text-accent-400"
            >
              PRO
            </button>
          ) : (
            <button
              onClick={onOpenLicense}
              className="whitespace-nowrap rounded-full px-3 py-2 text-xs text-bone-300 transition-colors hover:text-bone-100 sm:text-sm"
            >
              Have a key?
            </button>
          )}
          {/* Visible on every screen — this is the primary paid CTA. */}
          <a
            href="#pricing"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-bone-100 px-4 py-2 text-xs font-medium text-ink-950 transition duration-300 hover:bg-accent-400 active:scale-[0.97] sm:text-sm"
          >
            Get Pro
            <span aria-hidden className="font-mono text-[11px] text-ink-600">$39</span>
          </a>
        </div>
      </div>

      {/* Mobile in-page nav — desktop shows these inline above. */}
      <nav aria-label="Sections" className="md:hidden">
        <div className="mx-auto flex h-10 max-w-7xl items-center gap-1 overflow-x-auto px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs text-bone-300 hover:bg-ink-700 hover:text-bone-100"
            >
              {n.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

// The mark: a full square and, inside it, the same square at a fraction of
// the area — compression as a picture, not a metaphor icon.
export function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      <rect x="8" y="8" width="11" height="11" rx="3.5" fill="#b6f36a" className="origin-[19px_19px] transition-transform duration-500 group-hover:scale-75" />
    </svg>
  );
}
