import "server-only";
import type { BraveProviderConfig } from "@/features/provider/model/brave";

import type { SearchProvider } from "../../model/provider";
import type { SearchResult } from "../../model/search";
import { fetchWithTimeout } from "../lib/fetch-with-timeout";
import { ProviderHttpError } from "../lib/provider-http-error";

interface BraveResponse {
  web?: {
    results?: {
      url?: string;
      title?: string;
      description?: string;
      extra_snippets?: string[];
    }[];
  };
  query?: { more_results_available?: boolean };
}

export class BraveProvider implements SearchProvider<BraveProviderConfig> {
  readonly type = "brave" as const;

  constructor(readonly config: BraveProviderConfig) {}

  async search(query: string, count: number, timeoutMs: number): Promise<SearchResult[]> {
    const base = this.config.baseUrl.replace(/\/$/, "");
    const limit = Math.max(count, 1);
    const started = Date.now();

    const seen = new Set<string>();
    const results: SearchResult[] = [];

    for (let page = 0; page <= 9 && results.length < limit; page += 1) {
      const remaining = timeoutMs - (Date.now() - started);
      if (remaining <= 0) break;

      const pageSize = Math.min(20, limit - results.length);
      const url = this.buildUrl(base, query, page, pageSize);
      let data: BraveResponse;
      try {
        const res = await fetchWithTimeout(
          url,
          {
            headers: {
              Accept: "application/json",
              "X-Subscription-Token": this.config.apiKey,
            },
          },
          remaining,
        );
        if (!res.ok) {
          if (page === 0 || res.status === 429) {
            throw new ProviderHttpError("brave", res.status);
          }
          break;
        }
        data = (await res.json()) as BraveResponse;
      } catch (error) {
        if (page === 0 || (error instanceof ProviderHttpError && error.status === 429)) {
          throw error;
        }
        break;
      }

      for (const result of data.web?.results ?? []) {
        if (!result.url || seen.has(result.url)) continue;
        seen.add(result.url);
        results.push({
          link: result.url,
          title: result.title ?? "",
          snippet: [result.description, ...(result.extra_snippets ?? [])]
            .filter((s): s is string => Boolean(s))
            .join("\n\n"),
        });
        if (results.length >= limit) break;
      }

      if (data.query?.more_results_available === false) break;
    }

    return results.slice(0, limit);
  }

  private buildUrl(base: string, query: string, offset: number, count: number): string {
    const u = new URL(`${base}/res/v1/web/search`);
    u.searchParams.set("q", query);
    u.searchParams.set("count", String(count));
    u.searchParams.set("offset", String(offset));

    const { country, searchLang, uiLang, safesearch, freshness } = this.config.extra;
    if (country) u.searchParams.set("country", country.toUpperCase());
    if (searchLang) u.searchParams.set("search_lang", searchLang);
    if (uiLang) u.searchParams.set("ui_lang", uiLang);
    if (safesearch) u.searchParams.set("safesearch", safesearch);
    if (freshness) u.searchParams.set("freshness", freshness);
    if (this.config.extra.extraSnippets === "true") u.searchParams.set("extra_snippets", "true");
    return u.toString();
  }
}
