import "server-only";
import type { MwmblProviderConfig } from "@/features/provider/model/mwmbl";

import type { SearchProvider } from "../../model/provider";
import type { SearchResult } from "../../model/search";
import { fetchWithTimeout } from "../lib/fetch-with-timeout";
import { ProviderHttpError } from "../lib/provider-http-error";

interface MwmblResponse {
  results?: { url?: string; title?: string; content?: string }[];
}

export class MwmblProvider implements SearchProvider<MwmblProviderConfig> {
  readonly type = "mwmbl" as const;

  constructor(readonly config: MwmblProviderConfig) {}

  async search(query: string, count: number, timeoutMs: number): Promise<SearchResult[]> {
    const base = this.config.baseUrl.replace(/\/$/, "");
    const url = new URL(`${base}/api/v2/search/`);
    url.searchParams.set("q", query);

    const started = Date.now();
    const request = (apiKey: string) => {
      const headers: Record<string, string> = { Accept: "application/json" };
      if (apiKey) headers["X-API-Key"] = apiKey;
      const remaining = Math.max(timeoutMs - (Date.now() - started), 1);
      return fetchWithTimeout(url.toString(), { headers }, remaining);
    };

    let res = await request(this.config.apiKey);
    if (res.status === 401 && this.config.apiKey) res = await request("");

    if (!res.ok) throw new ProviderHttpError("mwmbl", res.status);
    const data = (await res.json()) as MwmblResponse;
    return (data.results ?? [])
      .filter((r) => r.url)
      .slice(0, count)
      .map((r) => ({
        link: r.url as string,
        title: r.title ?? "",
        snippet: r.content ?? "",
      }));
  }
}
