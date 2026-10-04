import { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Compressor from './components/Compressor';
import Features from './components/Features';
import AllConverters from './components/AllConverters';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import LicenseModal from './components/LicenseModal';
import { loadLicense, type LicenseState } from './lib/license';
import type { CompressSettings } from './types';

// Landing pages deep-link here with ?to=<format> to preset the output format
// (e.g. /png-to-webp links to /?to=webp#tool). Unknown values fall back to 'keep'.
function readInitialFormat(): CompressSettings['format'] | undefined {
  const raw = new URLSearchParams(window.location.search).get('to');
  if (!raw) return undefined;
  const norm = raw.toLowerCase() === 'jpg' ? 'jpeg' : raw.toLowerCase();
  return (['jpeg', 'png', 'webp', 'avif', 'jxl'] as const).includes(norm as never)
    ? (norm as CompressSettings['format'])
    : undefined;
}

export default function App() {
  const [license, setLicense] = useState<LicenseState | null>(null);
  const [licenseOpen, setLicenseOpen] = useState(false);
  // Read after mount: the page is prerendered, so the first render must not
  // depend on the URL.
  const [initialFormat, setInitialFormat] = useState<CompressSettings['format'] | undefined>();

  useEffect(() => { setLicense(loadLicense()); setInitialFormat(readInitialFormat()); }, []);

  // Deep-linked from a landing page — bring the tool into view.
  useEffect(() => {
    if (initialFormat) {
      document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [initialFormat]);

  return (
    <div className="grain flex min-h-dvh flex-col">
      <Header isPro={!!license} onOpenLicense={() => setLicenseOpen(true)} />
      <main className="flex-1">
        <Hero />
        <section id="tool" aria-labelledby="tool-title" className="mx-auto w-full max-w-7xl px-4 pb-28 pt-20 sm:px-8 sm:pt-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 id="tool-title" className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-medium leading-none tracking-[-0.035em]">
              The compressor
            </h2>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-bone-500">Runs in this tab · nothing uploaded</p>
          </div>
          <Compressor license={license} initialFormat={initialFormat} onUpgrade={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} />
        </section>
        <Features />
        <AllConverters />
        <Pricing isPro={!!license} onOpenLicense={() => setLicenseOpen(true)} />
        <FAQ />
      </main>
      <Footer />
      {licenseOpen && (
        <LicenseModal
          current={license}
          onClose={() => setLicenseOpen(false)}
          onActivated={(l) => { setLicense(l); setLicenseOpen(false); }}
        />
      )}
    </div>
  );
}
