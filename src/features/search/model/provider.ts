import type { CommonProviderConfig } from "@/features/provider/model/common";

import type { SearchResult } from "./search";

export interface SearchProvider<TConfig extends CommonProviderConfig = CommonProviderConfig> {
  readonly type: string;
  readonly config: TConfig;
  search(query: string, count: number, timeoutMs: number): Promise<SearchResult[]>;
}
