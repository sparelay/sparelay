import "server-only";
import type { TavilyProviderConfig } from "@/features/provider/model/tavily";

import type { SearchProvider } from "../../model/provider";
import type { SearchResult } from "../../model/search";
import { fetchWithTimeout } from "../lib/fetch-with-timeout";
import { ProviderHttpError } from "../lib/provider-http-error";

export class TavilyProvider implements SearchProvider<TavilyProviderConfig> {
  readonly type = "tavily" as const;

  constructor(readonly config: TavilyProviderConfig) {}

  async search(query: string, count: number, timeoutMs: number): Promise<SearchResult[]> {
    const base = this.config.baseUrl.replace(/\/$/, "");
    const searchDepth = this.config.extra.searchDepth || "basic";
    const body: Record<string, unknown> = {
      query,
      max_results: Math.min(Math.max(count, 1), 20),
      search_depth: searchDepth,
      topic: this.config.extra.topic || "general",
    };

    const timeRange = this.config.extra.timeRange.trim();
    if (timeRange) body.time_range = timeRange;
    if (this.config.extra.startDate) body.start_date = this.config.extra.startDate;
    if (this.config.extra.endDate) body.end_date = this.config.extra.endDate;

    const includeDomains = splitDomains(this.config.extra.includeDomains);
    if (includeDomains.length > 0) {
      body.include_domains = includeDomains;
      body.include_domains_mode = this.config.extra.includeDomainsMode;
    }
    const excludeDomains = splitDomains(this.config.extra.excludeDomains);
    if (excludeDomains.length > 0) body.exclude_domains = excludeDomains;

    const language = this.config.extra.language.trim();
    if (language) {
      body.language = language;
      if (this.config.extra.filterByLanguage === "true") body.filter_by_language = true;
    }

    if (
      this.config.extra.safeSearch === "true" &&
      searchDepth !== "fast" &&
      searchDepth !== "ultra-fast"
    ) {
      body.safe_search = true;
    }

    const res = await fetchWithTimeout(
      `${base}/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(body),
      },
      timeoutMs,
    );
    if (!res.ok) throw new ProviderHttpError("tavily", res.status);
    const data = (await res.json()) as {
      results?: { url?: string; title?: string; content?: string }[];
    };
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

function splitDomains(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
