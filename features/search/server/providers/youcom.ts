import "server-only";
import type { YoucomProviderConfig } from "@/features/provider/model/youcom";

import type { SearchProvider } from "../../model/provider";
import type { SearchResult } from "../../model/search";
import { fetchWithTimeout } from "../lib/fetch-with-timeout";
import { ProviderHttpError } from "../lib/provider-http-error";

export class YoucomProvider implements SearchProvider<YoucomProviderConfig> {
  readonly type = "youcom" as const;

  constructor(readonly config: YoucomProviderConfig) {}

  async search(query: string, count: number, timeoutMs: number): Promise<SearchResult[]> {
    const base = this.config.baseUrl.replace(/\/$/, "");
    const body: Record<string, unknown> = {
      query,
      count: Math.min(Math.max(count, 1), 100),
    };

    const freshness = this.config.extra.freshness.trim();
    if (freshness) body.freshness = freshness;

    const country = this.config.extra.country.trim().toUpperCase();
    if (country) body.country = country;

    const language = this.config.extra.language.trim();
    if (language) body.language = language;

    const safesearch = this.config.extra.safesearch.trim();
    if (safesearch) body.safesearch = safesearch;

    const includeDomains = splitDomains(this.config.extra.includeDomains);
    if (includeDomains.length > 0) {
      body.include_domains = includeDomains;
    } else {
      const excludeDomains = splitDomains(this.config.extra.excludeDomains);
      if (excludeDomains.length > 0) body.exclude_domains = excludeDomains;
    }

    if (this.config.extra.strictOperators === "true") body.strict_operators = true;

    const res = await fetchWithTimeout(
      `${base}/v1/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.config.apiKey,
        },
        body: JSON.stringify(body),
      },
      timeoutMs,
    );
    if (!res.ok) throw new ProviderHttpError("youcom", res.status);
    const data = (await res.json()) as {
      results?: {
        web?: { url?: string; title?: string; description?: string; snippets?: string[] }[];
      };
    };
    return (data.results?.web ?? [])
      .filter((r) => r.url)
      .slice(0, count)
      .map((r) => ({
        link: r.url as string,
        title: r.title ?? "",
        snippet: (r.snippets ?? []).join("\n\n") || r.description || "",
      }));
  }
}

function splitDomains(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
