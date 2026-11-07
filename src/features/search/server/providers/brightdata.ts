import "server-only";
import type { BrightdataProviderConfig } from "@/features/provider/model/brightdata";
import { z } from "@/shared/lib/zod";

import type { SearchProvider } from "../../model/provider";
import type { SearchResult } from "../../model/search";
import { fetchWithTimeout } from "../lib/fetch-with-timeout";
import { ProviderHttpError } from "../lib/provider-http-error";

const brightdataResponseSchema = z.object({
  organic: z
    .array(
      z.object({
        link: z.string().nullish(),
        url: z.string().nullish(),
        title: z.string().nullish(),
        description: z.string().nullish(),
        snippet: z.string().nullish(),
      }),
    )
    .nullish(),
  error: z.unknown().optional(),
});

function buildSearchUrl(
  query: string,
  count: number,
  extra: BrightdataProviderConfig["extra"],
): string {
  const { engine, domain, gl, hl, safe } = extra;
  const host = engine === "bing" ? "bing.com" : domain;
  const url = new URL(`https://www.${host}/search`);
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
  readonly type = "brightdata";

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

    const data = brightdataResponseSchema.parse(await res.json());
    if (data.error !== undefined) {
      throw new Error(
        `brightdata: ${typeof data.error === "string" ? data.error : JSON.stringify(data.error)}`,
      );
    }

    const results: SearchResult[] = [];
    for (const result of data.organic ?? []) {
      const link = result.link ?? result.url;
      if (!link) continue;
      results.push({
        link,
        title: result.title ?? "",
        snippet: result.description ?? result.snippet ?? "",
      });
      if (results.length >= count) break;
    }
    return results;
  }
}
