import "server-only";
import type { LinkupProviderConfig } from "@/features/provider/model/linkup";

import type { SearchProvider } from "../../model/provider";
import type { SearchResult } from "../../model/search";
import { fetchWithTimeout } from "../lib/fetch-with-timeout";
import { ProviderHttpError } from "../lib/provider-http-error";

export class LinkupProvider implements SearchProvider<LinkupProviderConfig> {
  readonly type = "linkup" as const;

  constructor(readonly config: LinkupProviderConfig) {}

  async search(query: string, count: number, timeoutMs: number): Promise<SearchResult[]> {
    const base = this.config.baseUrl.replace(/\/$/, "");
    const body: Record<string, unknown> = {
      q: query,
      depth: this.config.extra.depth || "fast",
      outputType: "searchResults",
      maxResults: Math.min(Math.max(count, 1), 100),
    };

    const includeDomains = splitDomains(this.config.extra.includeDomains);
    if (includeDomains.length > 0) body.includeDomains = includeDomains;

    const excludeDomains = splitDomains(this.config.extra.excludeDomains);
    if (excludeDomains.length > 0) body.excludeDomains = excludeDomains;

    if (this.config.extra.fromDate) body.fromDate = this.config.extra.fromDate;
    if (this.config.extra.toDate) body.toDate = this.config.extra.toDate;

    const res = await fetchWithTimeout(
      `${base}/v1/search`,
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
    if (!res.ok) throw new ProviderHttpError("linkup", res.status);
    const data = (await res.json()) as {
      results?: { url?: string; name?: string; content?: string }[];
    };
    return (data.results ?? [])
      .filter((r) => r.url)
      .slice(0, count)
      .map((r) => ({
        link: r.url as string,
        title: r.name ?? "",
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
