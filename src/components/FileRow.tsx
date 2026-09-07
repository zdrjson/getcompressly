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

  return (
    <div className="flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-900/60 p-3">
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-ink-700 flex items-center justify-center">
        {entry.previewUrl ? (
          <img src={entry.previewUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-[10px] text-zinc-500">IMG</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate text-sm font-medium text-zinc-100">{entry.file.name}</div>
          <Status entry={entry} />
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-500">
          <span>{bytes(entry.file.size)}</span>
          {entry.result && (
            <>
              <span>→</span>
              <span className="text-zinc-300 font-mono">{bytes(entry.result.outSize)}</span>
              <span className={r && r.pct >= 0 ? 'text-accent-400 font-semibold' : 'text-amber-400'}>
                {r && r.pct >= 0 ? `−${r.pct.toFixed(1)}%` : `+${Math.abs(r?.pct ?? 0).toFixed(1)}%`}
              </span>
              <span>· {FORMAT_LABEL[entry.result.outFormat]} · {entry.result.durationMs}ms</span>
            </>
          )}
          {entry.error && <span className="text-rose-400">{entry.error}</span>}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {entry.status === 'done' && (
          <button onClick={onDownload} className="rounded-md border border-ink-600 bg-ink-800 px-2.5 py-1.5 text-xs font-medium text-zinc-200 hover:border-accent-500 hover:text-accent-400">
            Save
          </button>
        )}
        <button onClick={onRemove} className="rounded-md p-1.5 text-zinc-500 hover:bg-ink-700 hover:text-zinc-200" aria-label="Remove">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  );
}

function Status({ entry }: { entry: FileEntry }) {
  if (entry.status === 'compressing') {
    return <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold tracking-wide text-accent-400">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-500" /> compressing
    </span>;
  }
  if (entry.status === 'done') return <span className="text-[10px] uppercase font-semibold tracking-wide text-emerald-400">done</span>;
  if (entry.status === 'error') return <span className="text-[10px] uppercase font-semibold tracking-wide text-rose-400">error</span>;
  return <span className="text-[10px] uppercase font-semibold tracking-wide text-zinc-500">queued</span>;
}
