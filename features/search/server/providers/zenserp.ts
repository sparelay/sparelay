import "server-only";
import type { ZenserpProviderConfig } from "@/features/provider/model/zenserp";

import type { SearchProvider } from "../../model/provider";
import type { SearchResult } from "../../model/search";
import { fetchWithTimeout } from "../lib/fetch-with-timeout";
import { ProviderHttpError } from "../lib/provider-http-error";

interface ZenserpResponse {
  organic?: { url?: string; destination?: string; title?: string; description?: string }[];
  error?: string;
}

export class ZenserpProvider implements SearchProvider<ZenserpProviderConfig> {
  readonly type = "zenserp" as const;

  constructor(readonly config: ZenserpProviderConfig) {}

  async search(query: string, count: number, timeoutMs: number): Promise<SearchResult[]> {
    const base = this.config.baseUrl.replace(/\/$/, "");
    const u = new URL(`${base}/api/v2/search`);
    u.searchParams.set("q", query);
    u.searchParams.set("engine", this.config.extra.engine || "google");
    u.searchParams.set("num", String(Math.min(Math.max(count, 1), 100)));

    const { gl, hl, location, device } = this.config.extra;
    if (gl) u.searchParams.set("gl", gl.toLowerCase());
    if (hl) u.searchParams.set("hl", hl);
    if (location) u.searchParams.set("location", location);
    if (device) u.searchParams.set("device", device);

    const res = await fetchWithTimeout(
      u.toString(),
      { headers: { apikey: this.config.apiKey, Accept: "application/json" } },
      timeoutMs,
    );
    if (!res.ok) throw new ProviderHttpError("zenserp", res.status);
    const data = (await res.json()) as ZenserpResponse;
    if (data.error) throw new Error(`zenserp: ${data.error}`);
    return (data.organic ?? [])
      .map((r) => ({ ...r, url: r.url ?? r.destination }))
      .filter((r) => r.url)
      .slice(0, count)
      .map((r) => ({
        link: r.url as string,
        title: r.title ?? "",
        snippet: r.description ?? "",
      }));
  }
}
