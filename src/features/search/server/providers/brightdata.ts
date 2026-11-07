import "server-only";
import type { BrightdataProviderConfig } from "@/features/provider/model/brightdata";

import type { SearchProvider } from "../../model/provider";
import type { SearchResult } from "../../model/search";
import { fetchWithTimeout } from "../lib/fetch-with-timeout";
import { ProviderHttpError } from "../lib/provider-http-error";

interface BrightdataOrganicResult {
  link?: string;
  url?: string;
  title?: string;
  description?: string;
  snippet?: string;
}

interface BrightdataResponse {
  organic?: BrightdataOrganicResult[];
  error?: string;
}

const SEARCH_URLS = {
  google: "https://www.google.com/search",
  bing: "https://www.bing.com/search",
} as const;

function buildSearchUrl(
  query: string,
  count: number,
  extra: BrightdataProviderConfig["extra"],
): string {
  const { engine, gl, hl, safe } = extra;
  const url = new URL(SEARCH_URLS[engine]);
  url.searchParams.set("q", query);

  if (engine === "google") {
    url.searchParams.set("num", String(Math.min(Math.max(count, 1), 100)));
    if (hl) url.searchParams.set("hl", hl);
    if (gl) url.searchParams.set("gl", gl.toLowerCase());
    if (safe) url.searchParams.set("safe", safe);
  } else {
    url.searchParams.set("count", String(Math.min(Math.max(count, 1), 50)));
    if (hl) url.searchParams.set("setlang", hl);
    if (gl) url.searchParams.set("cc", gl.toLowerCase());
    if (safe) url.searchParams.set("adlt", safe === "off" ? "off" : "strict");
  }

  return url.toString();
}

export class BrightdataProvider implements SearchProvider<BrightdataProviderConfig> {
  readonly type = "brightdata" as const;

  constructor(readonly config: BrightdataProviderConfig) {}

  async search(query: string, count: number, timeoutMs: number): Promise<SearchResult[]> {
    const base = this.config.baseUrl.replace(/\/$/, "");
    const body: Record<string, unknown> = {
      zone: this.config.extra.zone,
      url: buildSearchUrl(query, count, this.config.extra),
      format: "json",
    };
    if (this.config.extra.gl) body.country = this.config.extra.gl.toLowerCase();

    const res = await fetchWithTimeout(
      `${base}/request`,
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

    if (!res.ok) {
      let detail: string | undefined;
      try {
        detail = (await res.text()).trim() || undefined;
      } catch {}
      throw new ProviderHttpError("brightdata", res.status, detail);
    }

    const data = (await res.json()) as BrightdataResponse;
    if (data.error) throw new Error(`brightdata: ${data.error}`);
    return (data.organic ?? [])
      .filter((r) => r.link ?? r.url)
      .slice(0, count)
      .map((r) => ({
        link: (r.link ?? r.url) as string,
        title: r.title ?? "",
        snippet: r.description ?? r.snippet ?? "",
      }));
  }
}
