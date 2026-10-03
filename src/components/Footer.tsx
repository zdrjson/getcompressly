import { Logo } from './Header';

const GROUPS = [
  {
    title: 'Convert',
    links: [
      ['/png-to-webp', 'PNG to WebP'],
      ['/jpg-to-webp', 'JPG to WebP'],
      ['/webp-to-png', 'WebP to PNG'],
      ['/webp-to-jpg', 'WebP to JPG'],
      ['/compress-webp', 'Compress WebP'],
    ],
  },
  {
    title: 'AVIF',
    links: [
      ['/png-to-avif', 'PNG to AVIF'],
      ['/jpg-to-avif', 'JPG to AVIF'],
      ['/avif-to-jpg', 'AVIF to JPG'],
      ['/avif-to-png', 'AVIF to PNG'],
      ['/avif-converter', 'AVIF converter'],
    ],
  },
  {
    title: 'Product',
    links: [
      ['#tool', 'Tool'],
      ['#features', 'How it works'],
      ['#pricing', 'Pricing'],
      ['#faq', 'FAQ'],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ink-700/80 bg-ink-950">
      <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <a href="#" className="group inline-flex items-center gap-2.5 text-[17px] font-semibold tracking-[-0.02em]">
              <Logo /> Compressly
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone-500">
              Browser-based image compression. Built on jSquash and the Squoosh codec family.
            </p>
            <a
              href="#tool"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-ink-600 px-4 py-2.5 text-sm text-bone-100 transition hover:border-accent-500 hover:text-accent-400"
            >
              Compress something now <span aria-hidden>↑</span>
            </a>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {GROUPS.map((g) => (
              <div key={g.title}>
                <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-bone-600">{g.title}</div>
                <ul className="mt-4 text-sm text-bone-300">
                  {g.links.map(([href, label]) => (
                    <li key={href}>
                      <a href={href} className="inline-block py-1.5 transition-colors hover:text-accent-400">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-ink-700 py-6 text-xs text-bone-600 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Compressly. Compresses images — not your privacy.</span>
          <span className="flex gap-5">
            <a href="/privacy" className="hover:text-bone-100">Privacy</a>
            <a href="/terms" className="hover:text-bone-100">Terms</a>
            <a href="mailto:hello@getcompressly.com" className="hover:text-bone-100">hello@getcompressly.com</a>
          </span>
        </div>
      </div>

      {/* Oversized wordmark, sized to span the content width in full. */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden px-4 pb-6 sm:px-8 sm:pb-10">
        <div className="mx-auto max-w-7xl whitespace-nowrap text-[clamp(3rem,min(16.5vw,14.5rem),14.5rem)] font-medium leading-none tracking-[-0.06em] bg-gradient-to-b from-ink-600 to-ink-800 bg-clip-text text-transparent">
          Compressly
        </div>
      </div>
    </footer>
  );
}
