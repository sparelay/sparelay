import "server-only";
import type { ParallelProviderConfig } from "@/features/provider/model/parallel";

import type { SearchProvider } from "../../model/provider";
import type { SearchResult } from "../../model/search";
import { fetchWithTimeout } from "../lib/fetch-with-timeout";
import { ProviderHttpError } from "../lib/provider-http-error";

export class ParallelProvider implements SearchProvider<ParallelProviderConfig> {
  readonly type = "parallel" as const;

  constructor(readonly config: ParallelProviderConfig) {}

  async search(query: string, count: number, timeoutMs: number): Promise<SearchResult[]> {
    const base = this.config.baseUrl.replace(/\/$/, "");
    const advancedSettings: Record<string, unknown> = {
      max_results: Math.max(count, 1),
    };

    const includeDomains = splitDomains(this.config.extra.includeDomains);
    const excludeDomains = splitDomains(this.config.extra.excludeDomains);
    const sourcePolicy: Record<string, unknown> = {};
    if (includeDomains.length > 0) sourcePolicy.include_domains = includeDomains;
    else if (excludeDomains.length > 0) sourcePolicy.exclude_domains = excludeDomains;
    if (this.config.extra.afterDate) sourcePolicy.after_date = this.config.extra.afterDate;
    if (Object.keys(sourcePolicy).length > 0) advancedSettings.source_policy = sourcePolicy;

    const maxCharsPerResult = toOptionalInt(this.config.extra.maxCharsPerResult);
    if (maxCharsPerResult !== undefined) {
      advancedSettings.excerpt_settings = { max_chars_per_result: maxCharsPerResult };
    }

    const location = this.config.extra.location.trim().toUpperCase();
    if (location) advancedSettings.location = location;

    const body: Record<string, unknown> = {
      objective: query,
      search_queries: [query],
      mode: this.config.extra.mode || "advanced",
      advanced_settings: advancedSettings,
    };
    const maxCharsTotal = toOptionalInt(this.config.extra.maxCharsTotal);
    if (maxCharsTotal !== undefined) body.max_chars_total = maxCharsTotal;

    const res = await fetchWithTimeout(
      `${base}/v1/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.config.apiKey,
        },
        body: JSON.stringify(body),
      },
      timeoutMs,
    );
    if (!res.ok) throw new ProviderHttpError("parallel", res.status);
    const data = (await res.json()) as {
      results?: { url?: string; title?: string | null; excerpts?: string[] }[];
    };
    return (data.results ?? [])
      .filter((r) => r.url)
      .slice(0, count)
      .map((r) => ({
        link: r.url as string,
        title: r.title ?? "",
        snippet: (r.excerpts ?? []).join("\n\n"),
      }));
  }
}

function splitDomains(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function toOptionalInt(value: string): number | undefined {
  if (value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}
