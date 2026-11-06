import "server-only";
import type { ExaProviderConfig } from "@/features/provider/model/exa";

import type { SearchProvider } from "../../model/provider";
import type { SearchResult } from "../../model/search";
import { fetchWithTimeout } from "../lib/fetch-with-timeout";
import { ProviderHttpError } from "../lib/provider-http-error";

export class ExaProvider implements SearchProvider<ExaProviderConfig> {
  readonly type = "exa" as const;

  constructor(readonly config: ExaProviderConfig) {}

  async search(query: string, count: number, timeoutMs: number): Promise<SearchResult[]> {
    const base = this.config.baseUrl.replace(/\/$/, "");
    const type = this.config.extra.type || "auto";
    const category = this.config.extra.category.trim();
    const contents: Record<string, unknown> = { text: { maxCharacters: 1000 } };
    const maxAgeHours = toOptionalInt(this.config.extra.maxAgeHours);
    if (maxAgeHours !== undefined && type !== "lite") contents.maxAgeHours = maxAgeHours;

    const body: Record<string, unknown> = {
      query,
      numResults: Math.min(Math.max(count, 1), 100),
      type,
      contents,
    };
    if (category) body.category = category;

    const includeDomains = splitDomains(this.config.extra.includeDomains);
    if (includeDomains.length > 0) body.includeDomains = includeDomains;

    if (category !== "people") {
      const excludeDomains = splitDomains(this.config.extra.excludeDomains);
      if (excludeDomains.length > 0) body.excludeDomains = excludeDomains;
    }

    if (category !== "company" && category !== "people") {
      const start = this.config.extra.startPublishedDate;
      const end = this.config.extra.endPublishedDate;
      if (start) body.startPublishedDate = toIsoDate(start, false);
      if (end) body.endPublishedDate = toIsoDate(end, true);
    }

    if (this.config.extra.moderation === "true") body.moderation = true;

    const res = await fetchWithTimeout(
      `${base}/search`,
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
    if (!res.ok) throw new ProviderHttpError("exa", res.status);
    const data = (await res.json()) as {
      results?: { url?: string; title?: string; text?: string }[];
    };
    return (data.results ?? [])
      .filter((r) => r.url)
      .slice(0, count)
      .map((r) => ({
        link: r.url as string,
        title: r.title ?? "",
        snippet: r.text ?? "",
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

function toIsoDate(value: string, endOfDay: boolean): string {
  return `${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`;
}
