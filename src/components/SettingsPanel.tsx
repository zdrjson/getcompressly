import type { CompressSettings, Format } from '../types';
import { FORMAT_LABEL } from '../types';
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
    <div className="rounded-xl border border-ink-700 bg-ink-800/60 p-5 space-y-5">
      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-zinc-400 mb-2">Output format</label>
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-3 gap-1.5">
          {FORMAT_CHOICES.map((c) => {
            const locked = c.pro && !isPro;
            const active = settings.format === c.value;
            return (
              <button
                key={c.value}
                onClick={() => locked ? onUpgrade() : set('format', c.value)}
                className={`relative flex min-h-[44px] items-center justify-center rounded-md border px-2 py-1.5 text-center text-xs font-medium leading-tight transition ${
                  active
                    ? 'border-accent-500 bg-accent-500/10 text-accent-400'
                    : 'border-ink-600 bg-ink-900 text-zinc-300 hover:border-ink-500'
                } ${locked ? 'opacity-60' : ''}`}
              >
                {c.label}
                {locked && <span className="absolute -top-1.5 -right-1.5 rounded-full bg-accent-500 px-1 text-[9px] font-bold text-ink-950">PRO</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-400">Quality</label>
          <span className="font-mono text-sm text-accent-400">{settings.quality}</span>
        </div>
        <input
          type="range"
          min={1}
          max={100}
          value={settings.quality}
          onChange={(e) => set('quality', Number(e.target.value))}
          className="slider"
          disabled={settings.lossless}
        />
        <div className="mt-1 flex justify-between text-[10px] text-zinc-500">
          <span>Tiny</span><span>Balanced</span><span>Pristine</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-400">Effort</label>
          <span className="font-mono text-sm text-accent-400">{EFFORT_LABEL[effortBand(settings.effort)]}</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {([2, 5, 8] as const).map((v) => {
            const active = effortBand(settings.effort) === effortBand(v);
            return (
              <button
                key={v}
                onClick={() => set('effort', v)}
                className={`rounded-md border px-2 py-2 text-xs font-medium transition ${
                  active
                    ? 'border-accent-500 bg-accent-500/10 text-accent-400'
                    : 'border-ink-600 bg-ink-900 text-zinc-300 hover:border-ink-500'
                }`}
              >
                {EFFORT_LABEL[effortBand(v)]}
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-[11px] leading-snug text-zinc-500">
          How hard the encoder searches. Higher is slower and always lossless — it changes
          file size, never the pixels.
        </p>
      </div>

      <div className="flex items-start justify-between gap-3 rounded-md border border-ink-700 bg-ink-900 p-3">
        <div>
          <div className="text-sm font-medium">Lossless mode</div>
          <div className="text-xs text-zinc-500">Byte-perfect, no quality loss. Lossless WebP is usually smaller than an optimised PNG. WebP / AVIF / JXL — PNG output is always lossless.</div>
        </div>
        <Toggle on={settings.lossless} onChange={(v) => set('lossless', v)} />
      </div>

      <div className="flex items-start justify-between gap-3 rounded-md border border-ink-700 bg-ink-900 p-3">
        <div>
          <div className="text-sm font-medium">Preserve EXIF metadata</div>
          <div className="text-xs text-zinc-500">Keep camera, GPS and copyright tags.</div>
        </div>
        {isPro ? (
          <Toggle on={settings.preserveExif} onChange={(v) => set('preserveExif', v)} />
        ) : (
          <button onClick={onUpgrade} className="shrink-0 rounded-md bg-accent-500/10 px-2 py-1 text-[10px] font-bold text-accent-400 ring-1 ring-inset ring-accent-500/30">PRO</button>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-zinc-400 mb-2">Resize</label>
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
              className={`rounded-md border px-2 py-1.5 text-xs ${settings.resize.mode === opt.v ? 'border-accent-500 bg-accent-500/10 text-accent-400' : 'border-ink-600 bg-ink-900 text-zinc-300 hover:border-ink-500'}`}
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
              className="w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-zinc-100 focus:border-accent-500 focus:outline-none"
            />
            <span className="text-xs text-zinc-500">px</span>
          </div>
        )}
      </div>

      <div className="rounded-md bg-ink-900 border border-ink-700 px-3 py-2 text-[11px] text-zinc-500">
        Free tier: up to <span className="text-zinc-300">{lim.maxBatch}</span> files, max <span className="text-zinc-300">{lim.maxFileSizeMB} MB</span> each. {!isPro && (
          <button onClick={onUpgrade} className="ml-1 inline-block py-2 font-semibold text-accent-400 hover:underline">Upgrade →</button>
        )}
      </div>

      {FORMAT_LABEL /* keep import alive for tree-shake */ && null}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? 'bg-accent-500' : 'bg-ink-600'}`}
      role="switch"
      aria-checked={on}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}
