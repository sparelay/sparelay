export interface LogRow {
  id: string;
  query: string;
  providerName: string | null;
  providerType: string | null;
  source: string;
  attempts: number;
  resultsCount: number;
  durationMs: number;
  success: boolean;
  createdAt: string;
}

export interface LogDetail extends LogRow {
  resultsJson: { link: string; title: string; snippet: string }[];
}

export interface LogPage {
  rows: LogRow[];
  totalCount: number;
  page: {
    current: number;
    total: number;
    size: number;
  };
}
