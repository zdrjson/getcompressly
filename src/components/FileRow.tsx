import { useMemo } from 'react';
import type { FileEntry } from '../types';
import { FORMAT_LABEL } from '../types';
import { bytes, ratio } from '../lib/format';

interface Props {
  entry: FileEntry;
  onRemove: () => void;
  onDownload: () => void;
}

export default function FileRow({ entry, onRemove, onDownload }: Props) {
  const r = useMemo(() => entry.result ? ratio(entry.file.size, entry.result.outSize) : null, [entry]);

  const kept = entry.result && entry.file.size > 0 ? Math.min(100, (entry.result.outSize / entry.file.size) * 100) : 100;
  const grew = !!r && r.pct < 0;

  return (
    <div className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-ink-700 bg-ink-800/40 p-3 pr-2 transition-colors duration-300 hover:border-ink-600">
      {entry.status === 'compressing' && (
        <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute inset-y-0 left-0 w-1/3 animate-[scan-x_1.4s_var(--ease-out-expo)_infinite] bg-gradient-to-r from-transparent via-accent-500/[0.08] to-transparent" />
        </span>
      )}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-ink-700">
        {entry.previewUrl ? (
          <img src={entry.previewUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="grid h-full place-items-center font-mono text-[10px] text-bone-500">IMG</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5">
          <div className="truncate text-sm font-medium text-bone-100">{entry.file.name}</div>
          <Status entry={entry} />
        </div>
        <div className="tabular mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 font-mono text-[11px] text-bone-500">
          <span>{bytes(entry.file.size)}</span>
          {entry.result && (
            <>
              <span aria-hidden>→</span>
              <span className="text-bone-100">{bytes(entry.result.outSize)}</span>
              <span className={grew ? 'text-amber-300' : 'text-accent-400'}>
                {r && r.pct >= 0 ? `−${r.pct.toFixed(1)}%` : `+${Math.abs(r?.pct ?? 0).toFixed(1)}%`}
              </span>
              <span className="text-bone-600">{FORMAT_LABEL[entry.result.outFormat]} · {entry.result.durationMs}ms</span>
            </>
          )}
          {entry.error && <span className="text-rose-300">{entry.error}</span>}
        </div>
        {/* Bar: full width is the original; the filled part is what is left. */}
        <div className="mt-2 h-[3px] w-full max-w-xs overflow-hidden rounded-full bg-ink-600" aria-hidden>
          <div
            className={`h-full rounded-full transition-[width] duration-1000 ease-[var(--ease-out-expo)] ${grew ? 'bg-amber-300' : entry.result ? 'bg-accent-500' : 'bg-bone-600'}`}
            style={{ width: `${entry.result ? kept : entry.status === 'compressing' ? 100 : 0}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-1">
        {entry.status === 'done' && (
          <button onClick={onDownload} className="rounded-full border border-ink-600 bg-ink-900 px-3.5 py-2 text-xs font-medium text-bone-100 transition hover:border-accent-500 hover:text-accent-400 active:scale-[0.97]">
            Save
          </button>
        )}
        <button onClick={onRemove} className="rounded-full p-2 text-bone-500 transition hover:bg-ink-700 hover:text-bone-100" aria-label={`Remove ${entry.file.name}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  );
}

function Status({ entry }: { entry: FileEntry }) {
  if (entry.status === 'compressing') {
    return <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-accent-400">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-500" /> compressing
    </span>;
  }
  if (entry.status === 'done') return <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent-400">done</span>;
  if (entry.status === 'error') return <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-rose-300">error</span>;
  return <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-bone-500">queued</span>;
}
