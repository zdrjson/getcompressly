import type { CompressSettings, Format } from '../types';
import type { LicenseState } from '../lib/license';
import { limits } from '../lib/license';

interface Props {
  settings: CompressSettings;
  onChange: (s: CompressSettings) => void;
  license: LicenseState | null;
  onUpgrade: () => void;
}

const EFFORT_LABEL = { fast: 'Fast', balanced: 'Balanced', max: 'Maximum' } as const;

// The encoders each have their own effort scale; the UI offers three honest
// bands instead of a 0-9 number nobody can reason about.
function effortBand(effort: number): keyof typeof EFFORT_LABEL {
  if (effort <= 3) return 'fast';
  if (effort <= 6) return 'balanced';
  return 'max';
}

const FORMAT_CHOICES: Array<{ value: 'keep' | Format; label: string; pro?: boolean }> = [
  { value: 'keep', label: 'Keep original' },
  { value: 'jpeg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WebP' },
  { value: 'avif', label: 'AVIF' },
  { value: 'jxl', label: 'JXL', pro: true },
];

export default function SettingsPanel({ settings, onChange, license, onUpgrade }: Props) {
  const lim = limits(license);
  const isPro = !!license;

  function set<K extends keyof CompressSettings>(key: K, value: CompressSettings[K]) {
    onChange({ ...settings, [key]: value });
  }

  return (
    <div className="space-y-6 rounded-[24px] border border-ink-700 bg-ink-800/50 p-5 sm:p-6">
      <div>
        <label className="block font-mono text-[11px] uppercase tracking-[0.16em] text-bone-500 mb-2">Output format</label>
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-3 gap-1.5">
          {FORMAT_CHOICES.map((c) => {
            const locked = c.pro && !isPro;
            const active = settings.format === c.value;
            return (
              <button
                key={c.value}
                onClick={() => locked ? onUpgrade() : set('format', c.value)}
                className={`relative flex min-h-[44px] items-center justify-center rounded-xl border px-2 py-1.5 text-center text-xs font-medium leading-tight transition duration-300 active:scale-[0.97] ${
                  active
                    ? 'border-accent-500/70 bg-accent-500/[0.1] text-accent-400'
                    : 'border-ink-600 bg-ink-900 text-bone-300 hover:border-ink-500 hover:text-bone-100'
                } ${locked ? '!text-bone-500' : ''}`}
              >
                {c.label}
                {locked && <span className="absolute -top-1.5 -right-1.5 rounded-[4px] bg-accent-500 px-1 font-mono text-[9px] font-medium tracking-wider text-ink-950">PRO</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[11px] uppercase tracking-[0.16em] text-bone-500">Quality</label>
          <span className="tabular font-mono text-sm text-bone-100">{settings.lossless ? '—' : settings.quality}</span>
        </div>
        <input
          type="range"
          min={1}
          max={100}
          value={settings.quality}
          onChange={(e) => set('quality', Number(e.target.value))}
          className="slider"
          style={{ '--fill': `${settings.quality}%` } as React.CSSProperties}
          aria-label="Quality"
          disabled={settings.lossless}
        />
        <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-bone-600">
          <span>Tiny</span><span>Balanced</span><span>Pristine</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[11px] uppercase tracking-[0.16em] text-bone-500">Effort</label>
          <span className="font-mono text-sm text-bone-100">{EFFORT_LABEL[effortBand(settings.effort)]}</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {([2, 5, 8] as const).map((v) => {
            const active = effortBand(settings.effort) === effortBand(v);
            return (
              <button
                key={v}
                onClick={() => set('effort', v)}
                className={`rounded-xl border px-2 py-2.5 text-xs font-medium transition duration-300 active:scale-[0.97] ${
                  active
                    ? 'border-accent-500/70 bg-accent-500/[0.1] text-accent-400'
                    : 'border-ink-600 bg-ink-900 text-bone-300 hover:border-ink-500 hover:text-bone-100'
                }`}
              >
                {EFFORT_LABEL[effortBand(v)]}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-bone-500">
          How hard the encoder searches. Higher is slower and always lossless — it changes
          file size, never the pixels.
        </p>
      </div>

      <div className="flex items-start justify-between gap-4 rounded-2xl border border-ink-700 bg-ink-900/70 p-4">
        <div>
          <div className="text-sm font-medium">Lossless mode</div>
          <div className="mt-1 text-xs leading-relaxed text-bone-500">Byte-perfect, no quality loss. Lossless WebP is usually smaller than an optimised PNG. WebP / AVIF / JXL — PNG output is always lossless.</div>
        </div>
        <Toggle label="Lossless mode" on={settings.lossless} onChange={(v) => set('lossless', v)} />
      </div>

      <div className="flex items-start justify-between gap-4 rounded-2xl border border-ink-700 bg-ink-900/70 p-4">
        <div>
          <div className="text-sm font-medium">Preserve EXIF metadata</div>
          <div className="mt-1 text-xs leading-relaxed text-bone-500">Keep camera, GPS and copyright tags.</div>
        </div>
        {isPro ? (
          <Toggle label="Preserve EXIF metadata" on={settings.preserveExif} onChange={(v) => set('preserveExif', v)} />
        ) : (
          <button onClick={onUpgrade} className="shrink-0 rounded-full bg-accent-500/10 px-2.5 py-1 font-mono text-[10px] tracking-wider text-accent-400 ring-1 ring-inset ring-accent-500/30 transition hover:bg-accent-500/20">PRO</button>
        )}
      </div>

      <div>
        <label className="block font-mono text-[11px] uppercase tracking-[0.16em] text-bone-500 mb-2">Resize</label>
        <div className="grid grid-cols-4 gap-1.5 mb-2">
          {[
            { v: 'none', l: 'Off' },
            { v: 'longest', l: 'Longest side' },
            { v: 'width', l: 'Width' },
            { v: 'height', l: 'Height' },
          ].map((opt) => (
            <button
              key={opt.v}
              onClick={() => set('resize', { ...settings.resize, mode: opt.v as 'none' | 'longest' | 'width' | 'height' })}
              className={`rounded-xl border px-1.5 py-2 text-xs leading-tight transition duration-300 active:scale-[0.97] ${settings.resize.mode === opt.v ? 'border-accent-500/70 bg-accent-500/[0.1] text-accent-400' : 'border-ink-600 bg-ink-900 text-bone-300 hover:border-ink-500 hover:text-bone-100'}`}
            >
              {opt.l}
            </button>
          ))}
        </div>
        {settings.resize.mode !== 'none' && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={settings.resize.value}
              min={16}
              max={16384}
              onChange={(e) => set('resize', { ...settings.resize, value: Number(e.target.value) || 0 })}
              className="tabular w-full rounded-xl border border-ink-600 bg-ink-900 px-3 py-2.5 font-mono text-sm text-bone-100 focus:border-accent-500 focus:outline-none"
              aria-label="Resize target in pixels"
            />
            <span className="font-mono text-xs text-bone-500">px</span>
          </div>
        )}
      </div>

      <div className="border-t border-ink-700 pt-4 text-[11px] leading-relaxed text-bone-500">
        {isPro ? (
          <>Pro: unlimited files, max <span className="tabular text-bone-100">{lim.maxFileSizeMB} MB</span> each.</>
        ) : (
          <>
            Free tier: up to <span className="tabular text-bone-100">{lim.maxBatch}</span> files, max <span className="tabular text-bone-100">{lim.maxFileSizeMB} MB</span> each.
            <button onClick={onUpgrade} className="ml-1 inline-block py-2 font-medium text-accent-400 hover:underline">Upgrade →</button>
          </>
        )}
      </div>

    </div>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${on ? 'bg-accent-500' : 'bg-ink-600'}`}
      role="switch"
      aria-checked={on}
      aria-label={label}
    >
      <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-bone-100 shadow-sm transition-transform duration-300 ease-[var(--ease-out-expo)] ${on ? 'translate-x-5' : ''}`} />
    </button>
  );
}
