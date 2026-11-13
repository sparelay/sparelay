export const RANGES = ["1h", "6h", "12h", "1d", "3d", "7d", "14d", "30d"] as const;

export type Range = (typeof RANGES)[number];

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
