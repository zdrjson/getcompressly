export type Format = 'jpeg' | 'png' | 'webp' | 'avif' | 'jxl';

export interface CompressSettings {
  format: Format | 'keep';
  quality: number;          // 1-100
  lossless: boolean;        // png / webp / avif / jxl only
  preserveExif: boolean;    // Pro
  effort: number;           // 0-9 (avif/jxl)
  resize: { mode: 'none' | 'longest' | 'width' | 'height'; value: number };
}

export interface JobInput {
  id: string;
  name: string;
  originalSize: number;
  originalType: string;
  buffer: ArrayBuffer;       // transferable
  settings: CompressSettings;
}

export interface JobResult {
  id: string;
  outName: string;
  outFormat: Format;
  outSize: number;
  outBuffer: ArrayBuffer;
  durationMs: number;
}

export interface JobError {
  id: string;
  error: string;
}

export interface FileEntry {
  id: string;
  file: File;
  status: 'pending' | 'compressing' | 'done' | 'error';
  result?: JobResult;
  error?: string;
  previewUrl?: string;
}

export const DEFAULT_SETTINGS: CompressSettings = {
  format: 'keep',
  quality: 75,
  lossless: false,
  preserveExif: false,
  effort: 4,
  resize: { mode: 'none', value: 1920 },
};

export const FORMAT_LABEL: Record<Format, string> = {
  jpeg: 'JPG',
  png: 'PNG',
  webp: 'WebP',
  avif: 'AVIF',
  jxl: 'JXL',
};

export const FORMAT_MIME: Record<Format, string> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  jxl: 'image/jxl',
};

export const FORMAT_EXT: Record<Format, string> = {
  jpeg: 'jpg',
  png: 'png',
  webp: 'webp',
  avif: 'avif',
  jxl: 'jxl',
};

export function detectFormat(type: string, name: string): Format | null {
  const t = type.toLowerCase();
  if (t.includes('jpeg') || t.includes('jpg')) return 'jpeg';
  if (t.includes('png')) return 'png';
  if (t.includes('webp')) return 'webp';
  if (t.includes('avif')) return 'avif';
  if (t.includes('jxl')) return 'jxl';
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['jpg', 'jpeg'].includes(ext)) return 'jpeg';
  if (ext === 'png') return 'png';
  if (ext === 'webp') return 'webp';
  if (ext === 'avif') return 'avif';
  if (ext === 'jxl') return 'jxl';
  return null;
}
