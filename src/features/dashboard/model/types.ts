export interface ProviderStat {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  calls: number;
  success: number;
  fail: number;
  successRate: number;
  avgMs: number;
  lastUsed: string | null;
}

export interface Point {
  t: string;
  d: number;
}

export const RANGES = ["1h", "6h", "12h", "1d", "3d", "7d", "14d", "30d"] as const;

export type Range = (typeof RANGES)[number];
