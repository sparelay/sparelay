import "server-only";
import type { ApifyProviderConfig } from "@/features/provider/model/apify";

import type { SearchProvider } from "../../model/provider";
import type { SearchResult } from "../../model/search";
import { fetchWithTimeout } from "../lib/fetch-with-timeout";
import { ProviderHttpError } from "../lib/provider-http-error";

interface ApifyItem {
  organicResults?: { url?: string; title?: string; description?: string }[];
}

export class ApifyProvider implements SearchProvider<ApifyProviderConfig> {
  readonly type = "apify" as const;

  constructor(readonly config: ApifyProviderConfig) {}

  async search(query: string, count: number, timeoutMs: number): Promise<SearchResult[]> {
    const base = this.config.baseUrl.replace(/\/$/, "");
    const actorId = this.config.extra.actorId.trim();
    const input: Record<string, unknown> = {
      queries: query,
      maxPagesPerQuery: Math.min(Math.max(Math.ceil(count / 10), 1), 10),
    };

    const countryCode = this.config.extra.countryCode.trim().toUpperCase();
    if (countryCode) input.countryCode = countryCode;

    const languageCode = this.config.extra.languageCode.trim();
    if (languageCode) input.languageCode = languageCode;

    if (this.config.extra.mobileResults === "true") input.mobileResults = true;

    const quickDateRange = this.config.extra.quickDateRange.trim();
    if (quickDateRange) input.quickDateRange = quickDateRange;
    if (this.config.extra.beforeDate) input.beforeDate = this.config.extra.beforeDate;
    if (this.config.extra.afterDate) input.afterDate = this.config.extra.afterDate;

    const res = await fetchWithTimeout(
      `${base}/v2/actors/${encodeURIComponent(actorId)}/run-sync-get-dataset-items?format=json&clean=1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(input),
      },
      timeoutMs,
    );
    if (!res.ok) throw new ProviderHttpError("apify", res.status);
    const data = (await res.json()) as ApifyItem[];
    return data
      .flatMap((item) => item.organicResults ?? [])
      .filter((r) => r.url)
      .slice(0, count)
      .map((r) => ({
        link: r.url as string,
        title: r.title ?? "",
        snippet: r.description ?? "",
      }));
  }
}
