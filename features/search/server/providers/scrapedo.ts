import "server-only";
import type { ScrapedoProviderConfig } from "@/features/provider/model/scrapedo";

import type { SearchProvider } from "../../model/provider";
import type { SearchResult } from "../../model/search";
import { fetchWithTimeout } from "../lib/fetch-with-timeout";
import { ProviderHttpError } from "../lib/provider-http-error";

interface ScrapedoResponse {
  organic_results?: { title?: string; link?: string; snippet?: string }[];
  error?: string;
  message?: string;
  Message?: string | string[];
}

export class ScrapedoProvider implements SearchProvider<ScrapedoProviderConfig> {
  readonly type = "scrapedo" as const;

  constructor(readonly config: ScrapedoProviderConfig) {}

  async search(query: string, count: number, timeoutMs: number): Promise<SearchResult[]> {
    const base = this.config.baseUrl.replace(/\/$/, "");
    const u = new URL(`${base}/plugin/google/search`);
    u.searchParams.set("token", this.config.apiKey);
    u.searchParams.set("q", query);
    u.searchParams.set("start", "0");

    const { device, gl, hl, googleDomain, location, safe, timePeriod, resolveGoto } =
      this.config.extra;
    if (device) u.searchParams.set("device", device);
    if (gl) u.searchParams.set("gl", gl.toLowerCase());
    if (hl) u.searchParams.set("hl", hl);
    if (googleDomain) u.searchParams.set("google_domain", googleDomain);
    if (location) u.searchParams.set("location", location);
    if (safe === "true") u.searchParams.set("safe", "active");
    if (timePeriod) u.searchParams.set("time_period", timePeriod);
    if (resolveGoto === "true") u.searchParams.set("resolveGoto", "true");

    const res = await fetchWithTimeout(u.toString(), {}, timeoutMs);
    if (!res.ok) {
      let detail: string | undefined;
      try {
        const body = (await res.json()) as ScrapedoResponse;
        const raw = body.error ?? body.message ?? body.Message;
        detail = Array.isArray(raw) ? raw.join(" ") : raw;
      } catch {}
      throw new ProviderHttpError("scrapedo", res.status, detail);
    }

    const data = (await res.json()) as ScrapedoResponse;
    if (data.error) throw new Error(`scrapedo: ${data.error}`);
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
