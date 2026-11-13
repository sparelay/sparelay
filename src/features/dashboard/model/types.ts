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
  success: boolean;
  provider: string | null;
}
