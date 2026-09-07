import * as Comlink from 'comlink';
import type { CompressorApi } from './worker';
import type { JobInput, JobResult } from '../types';

// Pool of workers — uses navigator.hardwareConcurrency, capped to 4 to keep
// peak memory reasonable for laptops while still beating sequential.
const POOL_SIZE = Math.max(1, Math.min(4, (navigator.hardwareConcurrency ?? 4) - 1));

type WorkerSlot = {
  worker: Worker;
  api: Comlink.Remote<CompressorApi>;
  busy: boolean;
};

let pool: WorkerSlot[] | null = null;

function getPool(): WorkerSlot[] {
  if (pool) return pool;
  pool = Array.from({ length: POOL_SIZE }, () => {
    const w = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    return { worker: w, api: Comlink.wrap<CompressorApi>(w), busy: false };
  });
  return pool;
}

function pickSlot(slots: WorkerSlot[]): Promise<WorkerSlot> {
  return new Promise((resolve) => {
    const tryPick = () => {
      const free = slots.find((s) => !s.busy);
      if (free) {
        free.busy = true;
        resolve(free);
      } else {
        setTimeout(tryPick, 12);
      }
    };
    tryPick();
  });
}

export async function compressOne(job: JobInput): Promise<JobResult> {
  const slots = getPool();
  const slot = await pickSlot(slots);
  try {
    return await slot.api.compress(Comlink.transfer(job, [job.buffer]));
  } finally {
    slot.busy = false;
  }
}

export function poolSize(): number {
  return POOL_SIZE;
}
