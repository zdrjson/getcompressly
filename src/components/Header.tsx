interface Props { isPro: boolean; onOpenLicense: () => void }

const NAV = [
  { href: '#tool', label: 'Tool' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

export default function Header({ isPro, onOpenLicense }: Props) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-ink-900/70 border-b border-ink-700">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between gap-2">
        <a href="#" className="flex shrink-0 items-center gap-2 font-bold text-base sm:text-lg tracking-tight">
          <Logo />
          <span>Compressly</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="py-2 hover:text-zinc-100">{n.label}</a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isPro ? (
            <span className="rounded-full border border-accent-500/40 bg-accent-500/10 px-3 py-1.5 text-xs font-semibold text-accent-400">
              PRO
            </span>
          ) : (
            <button
              onClick={onOpenLicense}
              className="whitespace-nowrap px-1 py-2.5 text-xs sm:text-sm text-zinc-300 hover:text-zinc-100"
            >
              Have a key?
            </button>
          )}
          {/* Visible on every screen — this is the primary paid CTA. */}
          <a
            href="#pricing"
            className="inline-flex items-center whitespace-nowrap rounded-md bg-accent-500 px-3 py-2 text-xs sm:text-sm font-semibold text-ink-950 hover:bg-accent-400 transition"
          >
            Get Pro
          </a>
        </div>
      </div>

      {/* Mobile in-page nav — desktop shows these inline above. */}
      <nav className="md:hidden border-t border-ink-700/70">
        <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-ink-800 hover:text-zinc-100"
            >
              {n.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#a3ff5a" />
      <path d="M7 9.5L12 6.5L17 9.5V14.5L12 17.5L7 14.5V9.5Z" stroke="#06070a" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 6.5V17.5" stroke="#06070a" strokeWidth="1.6" />
    </svg>
  );
}
