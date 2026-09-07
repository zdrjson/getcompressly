import { useEffect, useState } from 'react';
import { activateLicense, clearLicense, type LicenseState } from '../lib/license';

interface Props {
  current: LicenseState | null;
  onClose: () => void;
  onActivated: (l: LicenseState) => void;
}

export default function LicenseModal({ current, onClose, onActivated }: Props) {
  const [key, setKey] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!key.trim()) return;
    setSubmitting(true);
    try {
      const l = await activateLicense(key.trim());
      onActivated(l);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  function deactivate() {
    clearLicense();
    window.location.reload();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-950/80 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-ink-600 bg-ink-800 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">{current ? 'Manage license' : 'Activate Pro'}</h3>
            <p className="mt-1 text-sm text-zinc-400">
              {current
                ? 'You\'re running Pro on this device.'
                : 'Paste the license key from your Lemon Squeezy receipt.'}
            </p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {current ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-md border border-accent-500/30 bg-accent-500/10 p-3 text-sm">
              <div className="font-medium text-accent-400">Pro · Active</div>
              {current.email && <div className="mt-1 text-xs text-zinc-400">{current.email}</div>}
              <div className="mt-1 font-mono text-xs text-zinc-500 break-all">{current.key}</div>
            </div>
            <button onClick={deactivate} className="w-full rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-300 hover:bg-rose-500/15">
              Deactivate on this device
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            <input
              autoFocus
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
              className="w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2.5 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-accent-500 focus:outline-none"
            />
            {error && <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{error}</div>}
            <button
              type="submit"
              disabled={submitting || !key.trim()}
              className="w-full rounded-md bg-accent-500 px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-accent-400 disabled:opacity-50"
            >
              {submitting ? 'Activating…' : 'Activate'}
            </button>
            <p className="text-center text-xs text-zinc-500">
              Don&apos;t have a key yet? <a href="#pricing" onClick={onClose} className="text-accent-400 hover:underline">Get Pro →</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
