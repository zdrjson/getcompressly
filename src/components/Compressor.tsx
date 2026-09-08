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
    <div className="grid lg:grid-cols-[1fr_320px] gap-6">
      <div>
        <div
          {...getRootProps()}
          className={`rounded-2xl border-2 border-dashed p-10 text-center transition cursor-pointer ${
            isDragActive ? 'border-accent-500 bg-accent-500/5' : 'border-ink-600 bg-ink-800/40 hover:border-ink-500'
          }`}
        >
          <input {...getInputProps()} />
          <div className="mx-auto h-12 w-12 rounded-full bg-accent-500/10 grid place-items-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-500"><path d="M12 15V3m0 0-4 4m4-4 4 4M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"/></svg>
          </div>
          <p className="text-base font-medium text-zinc-100">Drop images here or click to select</p>
          <p className="mt-1 text-xs text-zinc-500">JPG · PNG · WebP · AVIF · JXL — processed locally via {poolSize()} worker{poolSize() > 1 ? 's' : ''}</p>
        </div>

        {warning && (
          <div className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
            {warning}
          </div>
        )}

        {entries.length > 0 && (
          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="text-sm text-zinc-400">
                <span className="text-zinc-100 font-semibold">{entries.length}</span> file{entries.length === 1 ? '' : 's'}
                {doneCount > 0 && (
                  <>
                    {' · '}
                    saved{' '}
                    <span className="text-accent-400 font-semibold">
                      {bytes(totalIn - totalOut)} ({totalIn > 0 ? (((totalIn - totalOut) / totalIn) * 100).toFixed(1) : 0}%)
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={reprocessAll}
                  disabled={busyCount > 0}
                  className="rounded-md border border-ink-600 bg-ink-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-ink-500 disabled:opacity-50"
                >
                  Re-run with current settings
                </button>
                <button
                  onClick={downloadAllZip}
                  disabled={doneCount === 0}
                  className="rounded-md bg-accent-500 px-3 py-1.5 text-xs font-semibold text-ink-950 hover:bg-accent-400 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Download all ({doneCount}) as ZIP
                </button>
                <button onClick={clearAll} className="rounded-md p-1.5 text-zinc-500 hover:bg-ink-700 hover:text-zinc-200" aria-label="Clear">
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

      <aside className="lg:sticky lg:top-20 lg:self-start">
        <SettingsPanel settings={settings} onChange={setSettings} license={license} onUpgrade={onUpgrade} />
        {!isPro && (
          <button
            onClick={onUpgrade}
            className="mt-3 w-full rounded-xl border border-accent-500/30 bg-accent-500/10 px-4 py-3 text-sm font-semibold text-accent-400 hover:bg-accent-500/15 transition"
          >
            Unlock Pro — $39 one-time →
          </button>
        )}
      </aside>
    </div>
  );
}
