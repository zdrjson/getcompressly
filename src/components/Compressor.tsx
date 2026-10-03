import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { compressOne, poolSize } from '../lib/engine';
import { DEFAULT_SETTINGS, FORMAT_MIME, detectFormat } from '../types';
import type { CompressSettings, FileEntry, JobInput } from '../types';
import { limits, type LicenseState } from '../lib/license';
import { bytes } from '../lib/format';
import SettingsPanel from './SettingsPanel';
import FileRow from './FileRow';

// One-click starting points. Each is a full, honest settings combination —
// the panel on the right shows exactly what was applied.
const PRESETS: Array<{ name: string; note: string; apply: Partial<CompressSettings> }> = [
  { name: 'For the web', note: 'WebP · q75', apply: { format: 'webp', quality: 75, lossless: false, effort: 5, resize: { mode: 'none', value: 1920 } } },
  { name: 'Smallest file', note: 'AVIF · q50', apply: { format: 'avif', quality: 50, lossless: false, effort: 5, resize: { mode: 'none', value: 1920 } } },
  { name: 'Email-safe', note: 'JPG · q80 · 1920px', apply: { format: 'jpeg', quality: 80, lossless: false, effort: 5, resize: { mode: 'longest', value: 1920 } } },
  { name: 'Pixel-perfect', note: 'WebP · lossless', apply: { format: 'webp', lossless: true, effort: 5, resize: { mode: 'none', value: 1920 } } },
];

function matches(s: CompressSettings, p: Partial<CompressSettings>) {
  return (Object.keys(p) as Array<keyof CompressSettings>).every((k) =>
    k === 'resize' ? s.resize.mode === p.resize!.mode && (p.resize!.mode === 'none' || s.resize.value === p.resize!.value) : s[k] === p[k],
  );
}

interface Props {
  license: LicenseState | null;
  onUpgrade: () => void;
  initialFormat?: CompressSettings['format'];
}

export default function Compressor({ license, onUpgrade, initialFormat }: Props) {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [settings, setSettings] = useState<CompressSettings>(
    initialFormat ? { ...DEFAULT_SETTINGS, format: initialFormat } : DEFAULT_SETTINGS,
  );
  // addFiles is memoised on [lim], so a runJob captured in its closure would keep
  // whatever `settings` looked like on that render — changing quality or format
  // and *then* dropping files would silently compress with the old values.
  // Reading settings through a ref keeps every job on the current values.
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const [warning, setWarning] = useState<string | null>(null);
  const entriesRef = useRef<FileEntry[]>([]);
  entriesRef.current = entries;

  const lim = limits(license);
  const isPro = !!license;

  const totalIn = useMemo(() => entries.reduce((a, e) => a + e.file.size, 0), [entries]);
  const totalOut = useMemo(() => entries.reduce((a, e) => a + (e.result?.outSize ?? 0), 0), [entries]);
  const doneCount = entries.filter((e) => e.status === 'done').length;
  const busyCount = entries.filter((e) => e.status === 'compressing' || e.status === 'pending').length;

  // Auto-revoke object URLs on unmount
  useEffect(() => () => {
    entriesRef.current.forEach((e) => e.previewUrl && URL.revokeObjectURL(e.previewUrl));
  }, []);

  const runJob = useCallback(async (id: string, file: File) => {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, status: 'compressing' as const, result: undefined, error: undefined } : e));
    try {
      const buffer = await file.arrayBuffer();
      const job: JobInput = {
        id,
        name: file.name,
        originalSize: file.size,
        originalType: file.type,
        buffer,
        settings: settingsRef.current,
      };
      const result = await compressOne(job);
      setEntries((prev) => prev.map((e) => e.id === id ? { ...e, status: 'done', result } : e));
    } catch (err) {
      setEntries((prev) => prev.map((e) => e.id === id ? { ...e, status: 'error', error: (err as Error).message } : e));
    }
  }, []);

  const addFiles = useCallback((files: File[]) => {
    setWarning(null);
    const sizeLimit = lim.maxFileSizeMB * 1024 * 1024;
    const rejected: string[] = [];
    const accepted: FileEntry[] = [];

    for (const f of files) {
      if (!detectFormat(f.type, f.name)) {
        rejected.push(`${f.name}: unsupported format`);
        continue;
      }
      if (f.size > sizeLimit) {
        rejected.push(`${f.name}: ${bytes(f.size)} exceeds ${lim.maxFileSizeMB}MB limit`);
        continue;
      }
      accepted.push({
        id: crypto.randomUUID(),
        file: f,
        status: 'pending',
        previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
      });
    }

    const current = entriesRef.current;
    const remainingSlots = Math.max(0, lim.maxBatch - current.length);
    if (accepted.length > remainingSlots) {
      rejected.push(`Free tier holds up to ${lim.maxBatch} files at a time — ${accepted.length - remainingSlots} skipped`);
      accepted.length = remainingSlots;
    }

    if (rejected.length) {
      setWarning(rejected.join(' · '));
    }

    setEntries((prev) => [...prev, ...accepted]);
    // Kick off compression for the newly added entries — pass the file directly,
    // don't look it up by id (state hasn't flushed yet).
    accepted.forEach((e) => void runJob(e.id, e.file));
  }, [lim, runJob]);


  // Re-run with new settings: re-compress every entry from its source file.
  const reprocessAll = useCallback(() => {
    entriesRef.current.forEach((e) => void runJob(e.id, e.file));
  }, [runJob]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: addFiles,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/avif': ['.avif'],
      'image/jxl': ['.jxl'],
    },
    noClick: false,
    multiple: true,
  });

  function downloadOne(entry: FileEntry) {
    if (!entry.result) return;
    const blob = new Blob([entry.result.outBuffer], { type: FORMAT_MIME[entry.result.outFormat] });
    saveAs(blob, entry.result.outName);
  }

  async function downloadAllZip() {
    const zip = new JSZip();
    for (const e of entries) {
      if (e.result) {
        zip.file(e.result.outName, e.result.outBuffer);
      }
    }
    const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
    saveAs(blob, `compressly-${new Date().toISOString().slice(0,10)}.zip`);
  }

  function removeOne(id: string) {
    setEntries((prev) => {
      const target = prev.find((e) => e.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((e) => e.id !== id);
    });
  }

  function clearAll() {
    entriesRef.current.forEach((e) => e.previewUrl && URL.revokeObjectURL(e.previewUrl));
    setEntries([]);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="min-w-0">
        <div
          {...getRootProps()}
          className={`group relative isolate cursor-pointer overflow-hidden rounded-[28px] border px-6 text-center transition-[padding,background-color,border-color] duration-500 ${entries.length ? 'py-8' : 'py-14 sm:py-20'} ${
            isDragActive ? 'border-accent-500 bg-accent-500/[0.06]' : 'border-ink-600 bg-ink-800/50 hover:border-ink-500 hover:bg-ink-800/80'
          }`}
        >
          <input {...getInputProps({ 'aria-label': 'Choose images to compress' })} />
          {/* Corner ticks frame the target like a viewfinder. */}
          <span aria-hidden className="pointer-events-none absolute inset-4 -z-10">
            {['left-0 top-0 border-l border-t', 'right-0 top-0 border-r border-t', 'left-0 bottom-0 border-l border-b', 'right-0 bottom-0 border-r border-b'].map((c) => (
              <span key={c} className={`absolute h-5 w-5 rounded-[3px] transition-colors duration-500 ${c} ${isDragActive ? 'border-accent-500' : 'border-bone-600 group-hover:border-bone-300'}`} />
            ))}
          </span>
          <div className={`mx-auto mb-6 grid h-14 w-14 ${entries.length ? 'hidden' : ''} place-items-center rounded-2xl border transition duration-500 ${isDragActive ? 'scale-110 border-accent-500 bg-accent-500 text-ink-950' : 'border-ink-500 bg-ink-900 text-accent-500 group-hover:-translate-y-1'}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 15V4m0 0-4 4m4-4 4 4M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>
          </div>
          <p className="text-xl font-medium tracking-[-0.02em] text-bone-100 sm:text-2xl">
            {isDragActive ? 'Let go — they stay on this device' : <>Drop images here <span className="font-serif text-[1.1em] font-normal italic text-bone-300">or</span> click to select</>}
          </p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-bone-500">
            JPG · PNG · WebP · AVIF · JXL — processed locally via {poolSize()} worker{poolSize() > 1 ? 's' : ''}
          </p>
        </div>

        {warning && (
          <div role="status" className="mt-3 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] px-4 py-3 text-xs leading-relaxed text-amber-200">
            {warning}
          </div>
        )}

        {entries.length === 0 && (
          <div className="mt-6">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-bone-600">Or start from a preset</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PRESETS.map((p) => {
                const active = matches(settings, p.apply);
                return (
                  <button
                    key={p.name}
                    onClick={() => setSettings({ ...settings, ...p.apply })}
                    aria-pressed={active}
                    className={`group rounded-2xl border p-4 text-left transition duration-300 active:scale-[0.98] ${
                      active ? 'border-accent-500/60 bg-accent-500/[0.07]' : 'border-ink-700 bg-ink-800/30 hover:border-ink-500 hover:bg-ink-800/60'
                    }`}
                  >
                    <span className={`block text-sm font-medium ${active ? 'text-accent-400' : 'text-bone-100'}`}>{p.name}</span>
                    <span className="mt-1 block font-mono text-[11px] text-bone-500">{p.note}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {entries.length > 0 && (
          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="tabular text-sm text-bone-300" aria-live="polite">
                <span className="font-medium text-bone-100">{entries.length}</span> file{entries.length === 1 ? '' : 's'}
                {doneCount > 0 && (
                  <>
                    {' · '}
                    saved{' '}
                    <span className="font-medium text-accent-400">
                      {bytes(totalIn - totalOut)} ({totalIn > 0 ? (((totalIn - totalOut) / totalIn) * 100).toFixed(1) : 0}%)
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={reprocessAll}
                  disabled={busyCount > 0}
                  className="rounded-full border border-ink-600 bg-ink-800 px-3.5 py-2 text-xs font-medium text-bone-100 transition hover:border-ink-500 active:scale-[0.97] disabled:opacity-50"
                >
                  Re-run with current settings
                </button>
                <button
                  onClick={downloadAllZip}
                  disabled={doneCount === 0}
                  className="rounded-full bg-accent-500 px-3.5 py-2 text-xs font-medium text-ink-950 transition hover:bg-accent-400 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Download all ({doneCount}) as ZIP
                </button>
                <button onClick={clearAll} className="rounded-full p-2 text-bone-500 transition hover:bg-ink-700 hover:text-bone-100" aria-label="Clear all files">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {entries.map((e) => (
                <FileRow key={e.id} entry={e} onRemove={() => removeOne(e.id)} onDownload={() => downloadOne(e)} />
              ))}
            </div>
          </div>
        )}
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <SettingsPanel settings={settings} onChange={setSettings} license={license} onUpgrade={onUpgrade} />
        {!isPro && (
          <button
            onClick={onUpgrade}
            className="group mt-3 flex w-full items-center justify-between rounded-2xl border border-accent-500/25 bg-accent-500/[0.07] px-5 py-4 text-sm font-medium text-accent-400 transition hover:bg-accent-500/[0.12]"
          >
            <span>Unlock Pro — $39 one-time</span><span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        )}
      </aside>
    </div>
  );
}
