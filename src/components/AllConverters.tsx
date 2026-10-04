import Reveal from './Reveal';
import { CONVERTERS } from '../site';

const GROUPS = [
  { title: 'WebP', slugs: ['png-to-webp', 'jpg-to-webp', 'webp-to-png', 'webp-to-jpg', 'compress-webp'] },
  { title: 'AVIF', slugs: ['png-to-avif', 'jpg-to-avif', 'avif-to-jpg', 'avif-to-png', 'avif-converter'] },
];

// Every converter page, linked from the home page with descriptive anchors.
export default function AllConverters() {
  return (
    <section id="converters" aria-labelledby="converters-title" className="border-t border-ink-700/80">
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-24 sm:px-8 sm:pt-32">
        <Reveal className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone-600">All converters</p>
            <h2 id="converters-title" className="mt-5 text-balance text-[clamp(2.25rem,4.6vw,4rem)] font-medium leading-[0.98] tracking-[-0.04em]">
              One format to another, <span className="font-serif font-normal italic text-bone-300">preset.</span>
            </h2>
          </div>
          <p className="self-end text-pretty leading-relaxed text-bone-300 lg:col-span-4 lg:col-start-9">
            Each converter opens the same compressor with the output format already chosen, plus a short guide to when the
            switch is worth it.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {GROUPS.map((g, gi) => (
            <Reveal key={g.title} delay={gi * 100}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-bone-500">{g.title}</h3>
              <ul className="mt-4 divide-y divide-ink-700 rounded-[28px] border border-ink-700 bg-ink-800/30">
                {g.slugs.map((slug) => {
                  const c = CONVERTERS.find((x) => x.slug === slug)!;
                  return (
                    <li key={slug}>
                      <a href={`/${slug}`} className="group flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-ink-800/60 sm:px-8">
                        <span>
                          <span className="block font-medium tracking-[-0.01em] text-bone-100 transition-colors group-hover:text-accent-400">{c.anchor}</span>
                          <span className="mt-1 block text-sm text-bone-500">{c.blurb}</span>
                        </span>
                        <span aria-hidden className="text-bone-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent-400">→</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
