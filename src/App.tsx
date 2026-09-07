import { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Compressor from './components/Compressor';
import Features from './components/Features';
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
  const [initialFormat] = useState(readInitialFormat);

  useEffect(() => { setLicense(loadLicense()); }, []);

  // Deep-linked from a landing page — bring the tool into view.
  useEffect(() => {
    if (initialFormat) {
      document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [initialFormat]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header isPro={!!license} onOpenLicense={() => setLicenseOpen(true)} />
      <main className="flex-1">
        <Hero />
        <section id="tool" className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-20">
          <Compressor license={license} initialFormat={initialFormat} onUpgrade={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} />
        </section>
        <Features />
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
