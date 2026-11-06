import type { ProviderType } from "@/features/provider/model/provider";
import type { SearchResult } from "@/features/search/model/search";

export interface PlaygroundResult {
  results: SearchResult[];
  providerName: string | null;
  attempts: number;
  durationMs: number;
}

export interface PlaygroundProviderOption {
  id: string;
  name: string;
  type: ProviderType;
}
