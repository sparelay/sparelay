import "server-only";
import type { SerpapiProviderConfig } from "@/features/provider/model/serpapi";

import type { SearchProvider } from "../../model/provider";
import type { SearchResult } from "../../model/search";
import { fetchWithTimeout } from "../lib/fetch-with-timeout";
import { ProviderHttpError } from "../lib/provider-http-error";

interface SerpapiResponse {
  organic_results?: { link?: string; title?: string; snippet?: string }[];
  error?: string;
}

export class SerpapiProvider implements SearchProvider<SerpapiProviderConfig> {
  readonly type = "serpapi" as const;

  constructor(readonly config: SerpapiProviderConfig) {}

  async search(query: string, count: number, timeoutMs: number): Promise<SearchResult[]> {
    const base = this.config.baseUrl.replace(/\/$/, "");
    const u = new URL(`${base}/search.json`);
    u.searchParams.set("engine", "google");
    u.searchParams.set("q", query);
    u.searchParams.set("api_key", this.config.apiKey);
    u.searchParams.set("num", String(Math.min(Math.max(count, 1), 100)));

    const { location, gl, hl, googleDomain, device, safe, tbs } = this.config.extra;
    if (location) u.searchParams.set("location", location);
    if (gl) u.searchParams.set("gl", gl.toLowerCase());
    if (hl) u.searchParams.set("hl", hl);
    if (googleDomain) u.searchParams.set("google_domain", googleDomain);
    if (device) u.searchParams.set("device", device);
    if (safe) u.searchParams.set("safe", safe);
    if (tbs) u.searchParams.set("tbs", tbs);

    const res = await fetchWithTimeout(u.toString(), {}, timeoutMs);
    if (!res.ok) throw new ProviderHttpError("serpapi", res.status);
    const data = (await res.json()) as SerpapiResponse;
    if (data.error) throw new Error(`serpapi: ${data.error}`);
    return (data.organic_results ?? [])
      .filter((r) => r.link)
      .slice(0, count)
      .map((r) => ({
        link: r.link as string,
        title: r.title ?? "",
        snippet: r.snippet ?? "",
      }));
  }
}
