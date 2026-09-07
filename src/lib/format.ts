export function bytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(2)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function ratio(originalBytes: number, newBytes: number): { saved: number; pct: number } {
  const saved = originalBytes - newBytes;
  const pct = originalBytes > 0 ? (saved / originalBytes) * 100 : 0;
  return { saved, pct };
}
