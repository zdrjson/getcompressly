/**
 * Landing-page tool embed.
 *
 * Static landing pages keep their SEO content in the served HTML and mount the
 * real compressor into <div id="tool-embed" data-to="avif">. The page stays
 * fully crawlable without JS; the tool appears for humans.
 */
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Compressor from './components/Compressor';
import LicenseModal from './components/LicenseModal';
import { loadLicense, type LicenseState } from './lib/license';
import type { CompressSettings } from './types';
import './styles.css';

const FORMATS = ['jpeg', 'png', 'webp', 'avif', 'jxl'] as const;

function normalize(raw: string | null | undefined): CompressSettings['format'] | undefined {
  if (!raw) return undefined;
  const v = raw.toLowerCase() === 'jpg' ? 'jpeg' : raw.toLowerCase();
  return (FORMATS as readonly string[]).includes(v) ? (v as CompressSettings['format']) : undefined;
}

function EmbeddedTool({ initialFormat }: { initialFormat?: CompressSettings['format'] }) {
  const [license, setLicense] = useState<LicenseState | null>(null);
  const [licenseOpen, setLicenseOpen] = useState(false);

  useEffect(() => { setLicense(loadLicense()); }, []);

  return (
    <>
      <Compressor
        license={license}
        initialFormat={initialFormat}
        onUpgrade={() => { window.location.href = '/#pricing'; }}
      />
      <p className="mt-4 text-center text-xs text-zinc-500">
        Already bought Pro?{' '}
        <button onClick={() => setLicenseOpen(true)} className="py-2 font-semibold text-accent-400 hover:underline">
          Enter your license key
        </button>
      </p>
      {licenseOpen && (
        <LicenseModal
          current={license}
          onClose={() => setLicenseOpen(false)}
          onActivated={(l) => { setLicense(l); setLicenseOpen(false); }}
        />
      )}
    </>
  );
}

const host = document.getElementById('tool-embed');
if (host) {
  createRoot(host).render(
    <StrictMode>
      <EmbeddedTool initialFormat={normalize(host.dataset.to)} />
    </StrictMode>,
  );
}
