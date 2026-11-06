import "server-only";
import type { FirecrawlProviderConfig } from "@/features/provider/model/firecrawl";

import type { SearchProvider } from "../../model/provider";
import type { SearchResult } from "../../model/search";
import { fetchWithTimeout } from "../lib/fetch-with-timeout";
import { ProviderHttpError } from "../lib/provider-http-error";

interface FirecrawlItem {
  url?: string;
  title?: string;
  description?: string;
  snippet?: string;
}

interface FirecrawlResponse {
  success?: boolean;
  data?: { web?: FirecrawlItem[]; news?: FirecrawlItem[] } | FirecrawlItem[];
  error?: string;
}

export class FirecrawlProvider implements SearchProvider<FirecrawlProviderConfig> {
  readonly type = "firecrawl" as const;

  constructor(readonly config: FirecrawlProviderConfig) {}

  async search(query: string, count: number, timeoutMs: number): Promise<SearchResult[]> {
    const base = this.config.baseUrl.replace(/\/$/, "");
    const body: Record<string, unknown> = {
      query,
      limit: Math.min(Math.max(count, 1), 100),
    };

    const { tbs, location, country, safe, category } = this.config.extra;
    if (tbs) body.tbs = tbs;
    if (location) body.location = location;
    if (country) body.country = country.toUpperCase();
    if (safe === "true") body.safe = true;
    if (category) body.categories = [category];

    const includeDomains = splitDomains(this.config.extra.includeDomains);
    if (includeDomains.length > 0) {
      body.includeDomains = includeDomains;
    } else {
      const excludeDomains = splitDomains(this.config.extra.excludeDomains);
      if (excludeDomains.length > 0) body.excludeDomains = excludeDomains;
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (this.config.apiKey) headers.Authorization = `Bearer ${this.config.apiKey}`;

    const res = await fetchWithTimeout(
      `${base}/v2/search`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      },
      timeoutMs,
    );
    if (!res.ok) throw new ProviderHttpError("firecrawl", res.status);
    const payload = (await res.json()) as FirecrawlResponse;
    if (payload.success === false) {
      throw new Error(`firecrawl: ${payload.error ?? "search failed"}`);
    }

    const data = payload.data;
    const items = Array.isArray(data) ? data : [...(data?.web ?? []), ...(data?.news ?? [])];
    return items
      .filter((r) => r.url)
      .slice(0, count)
      .map((r) => ({
        link: r.url as string,
        title: r.title ?? "",
        snippet: r.description ?? r.snippet ?? "",
      }));
  }
}

function splitDomains(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
