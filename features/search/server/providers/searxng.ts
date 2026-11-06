import "server-only";
import type { SearxngProviderConfig } from "@/features/provider/model/searxng";

import type { SearchProvider } from "../../model/provider";
import type { SearchResult } from "../../model/search";
import { fetchWithTimeout } from "../lib/fetch-with-timeout";
import { ProviderHttpError } from "../lib/provider-http-error";

const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const MAX_PAGES = 10;

interface SearxngResponse {
  results?: { url?: string; title?: string; content?: string }[];
}

export class SearxngProvider implements SearchProvider<SearxngProviderConfig> {
  readonly type = "searxng" as const;

  constructor(readonly config: SearxngProviderConfig) {}

  async search(query: string, count: number, timeoutMs: number): Promise<SearchResult[]> {
    const started = Date.now();
    const limit = Math.max(count, 1);
    const headers: Record<string, string> = { "User-Agent": UA };
    if (this.config.apiKey) headers["X-API-Key"] = this.config.apiKey;

    const seen = new Set<string>();
    const results: SearchResult[] = [];

    for (let page = 1; page <= MAX_PAGES && results.length < limit; page += 1) {
      const remaining = timeoutMs - (Date.now() - started);
      if (remaining <= 0) break;

      let data: SearxngResponse;
      try {
        const res = await fetchWithTimeout(this.buildUrl(query, page), { headers }, remaining);
        if (!res.ok) {
          if (page === 1 || res.status === 429) {
            throw new ProviderHttpError("searxng", res.status);
          }
          break;
        }
        data = (await res.json()) as SearxngResponse;
      } catch (error) {
        if (page === 1 || (error instanceof ProviderHttpError && error.status === 429)) {
          throw error;
        }
        break;
      }

      let added = 0;
      for (const result of data.results ?? []) {
        if (!result.url || seen.has(result.url)) continue;
        seen.add(result.url);
        results.push({
          link: result.url,
          title: result.title ?? "",
          snippet: result.content ?? "",
        });
        added += 1;
        if (results.length >= limit) break;
      }
      if (added === 0) break;
    }

    return results.slice(0, limit);
  }

  private buildUrl(query: string, page: number): string {
    const u = new URL(this.config.baseUrl);
    u.searchParams.set("q", query);
    u.searchParams.set("format", "json");
    u.searchParams.set("pageno", String(page));
    const { language, categories, timeRange, safesearch } = this.config.extra;
    if (language) u.searchParams.set("language", language);
    if (categories) u.searchParams.set("categories", categories);
    if (timeRange) u.searchParams.set("time_range", timeRange);
    if (safesearch) u.searchParams.set("safesearch", safesearch);
    return u.toString();
  }
}
