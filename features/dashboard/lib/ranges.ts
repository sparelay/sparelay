import type { Range } from "../model/types";

const RANGE_HOURS: Record<string, number> = {
  "1h": 1,
  "6h": 6,
  "12h": 12,
  "1d": 24,
  "3d": 72,
  "7d": 168,
  "14d": 336,
  "30d": 720,
};

export function rangeHours(range: Range): { range: Range; hours: number } {
  if (RANGE_HOURS[range] !== undefined) return { range, hours: RANGE_HOURS[range] };
  return { range: "7d", hours: 168 };
}

export function sinceModifier(hours: number): string {
  return `-${hours} hours`;
}

export function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[Math.max(0, idx)];
}
