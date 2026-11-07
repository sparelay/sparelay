import { afterEach, describe, expect, it, vi } from "vitest";

import { apifyProviderConfigSchema } from "@/features/provider/model/apify";
import { braveProviderConfigSchema } from "@/features/provider/model/brave";
import { brightdataProviderConfigSchema } from "@/features/provider/model/brightdata";
import { exaProviderConfigSchema } from "@/features/provider/model/exa";
import { firecrawlProviderConfigSchema } from "@/features/provider/model/firecrawl";
import { linkupProviderConfigSchema } from "@/features/provider/model/linkup";
import { mwmblProviderConfigSchema } from "@/features/provider/model/mwmbl";
import { parallelProviderConfigSchema } from "@/features/provider/model/parallel";
import { scrapedoProviderConfigSchema } from "@/features/provider/model/scrapedo";
import { searxngProviderConfigSchema } from "@/features/provider/model/searxng";
import { serpapiProviderConfigSchema } from "@/features/provider/model/serpapi";
import { tavilyProviderConfigSchema } from "@/features/provider/model/tavily";
import { youcomProviderConfigSchema } from "@/features/provider/model/youcom";
import { zenserpProviderConfigSchema } from "@/features/provider/model/zenserp";

import { ApifyProvider } from "./apify";
import { BraveProvider } from "./brave";
import { BrightdataProvider } from "./brightdata";
import { ExaProvider } from "./exa";
import { FirecrawlProvider } from "./firecrawl";
import { LinkupProvider } from "./linkup";
import { MwmblProvider } from "./mwmbl";
import { ParallelProvider } from "./parallel";
import { ScrapedoProvider } from "./scrapedo";
import { SearxngProvider } from "./searxng";
import { SerpapiProvider } from "./serpapi";
import { TavilyProvider } from "./tavily";
import { YoucomProvider } from "./youcom";
import { ZenserpProvider } from "./zenserp";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("SearxngProvider", () => {
  it("maps results and forwards extra params", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({
        results: [
          { url: "https://a", title: "A", content: "a" },
          { title: "no url" },
          { url: "https://b", title: "B", content: "b" },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = searxngProviderConfigSchema.parse({
      id: "p1",
      name: "SearXNG",
      baseUrl: "https://searx.test/",
      apiKey: "key",
      extra: {
        language: "ja",
        categories: "news",
        timeRange: "week",
        safesearch: "1",
      },
    });
    const results = await new SearxngProvider(config).search("hello", 1, 1000);

    expect(results).toEqual([{ link: "https://a", title: "A", snippet: "a" }]);
    const call = fetchMock.mock.calls[0];
    const url = new URL(String(call?.[0]));
    expect(url.searchParams.get("q")).toBe("hello");
    expect(url.searchParams.get("format")).toBe("json");
    expect(url.searchParams.get("pageno")).toBe("1");
    expect(url.searchParams.get("language")).toBe("ja");
    expect(url.searchParams.get("categories")).toBe("news");
    expect(url.searchParams.get("time_range")).toBe("week");
    expect(url.searchParams.get("safesearch")).toBe("1");
    expect(call?.[1]?.headers).toMatchObject({ "X-API-Key": "key" });
  });

  it("pages until count is reached and de-duplicates results", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const page = new URL(String(input)).searchParams.get("pageno");
      if (page === "1") {
        return jsonResponse({
          results: [
            { url: "https://a", title: "A", content: "a" },
            { url: "https://b", title: "B", content: "b" },
          ],
        });
      }
      if (page === "2") {
        return jsonResponse({
          results: [
            { url: "https://b", title: "B", content: "b" },
            { url: "https://c", title: "C", content: "c" },
          ],
        });
      }
      return jsonResponse({ results: [] });
    });
    vi.stubGlobal("fetch", fetchMock);

    const config = searxngProviderConfigSchema.parse({
      id: "p1",
      name: "SearXNG",
      baseUrl: "https://searx.test",
      apiKey: "",
      extra: {},
    });
    const results = await new SearxngProvider(config).search("hello", 3, 1000);

    expect(results.map((r) => r.link)).toEqual(["https://a", "https://b", "https://c"]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("returns collected results when a later page fails", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const page = new URL(String(input)).searchParams.get("pageno");
      if (page === "1") {
        return jsonResponse({ results: [{ url: "https://a", title: "A", content: "a" }] });
      }
      return new Response("", { status: 500 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const config = searxngProviderConfigSchema.parse({
      id: "p1",
      name: "SearXNG",
      baseUrl: "https://searx.test",
      apiKey: "",
      extra: {},
    });
    const results = await new SearxngProvider(config).search("hello", 5, 1000);

    expect(results).toEqual([{ link: "https://a", title: "A", snippet: "a" }]);
  });

  it("throws on a non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("", { status: 500 })),
    );
    const config = searxngProviderConfigSchema.parse({
      id: "p1",
      name: "SearXNG",
      baseUrl: "https://searx.test",
      apiKey: "",
      extra: {},
    });
    await expect(new SearxngProvider(config).search("q", 5, 1000)).rejects.toThrow(
      "searxng http 500",
    );
  });
});

describe("TavilyProvider", () => {
  it("clamps max_results and maps results", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({
        results: [{ url: "https://a", title: "A", content: "a" }],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = tavilyProviderConfigSchema.parse({
      id: "p1",
      name: "Tavily",
      baseUrl: "https://api.tavily.test/",
      apiKey: "tk",
      extra: {},
    });
    const results = await new TavilyProvider(config).search("hello", 30, 1000);

    expect(results).toEqual([{ link: "https://a", title: "A", snippet: "a" }]);
    const call = fetchMock.mock.calls[0];
    expect(String(call?.[0])).toBe("https://api.tavily.test/search");
    expect(call?.[1]?.headers).toMatchObject({ Authorization: "Bearer tk" });
    const body = JSON.parse(String(call?.[1]?.body));
    expect(body.max_results).toBe(20);
    expect(body.search_depth).toBe("basic");
  });

  it("forwards the advanced search options", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({ results: [] }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = tavilyProviderConfigSchema.parse({
      id: "p1",
      name: "Tavily",
      baseUrl: "https://api.tavily.test",
      apiKey: "tk",
      extra: {
        searchDepth: "advanced",
        topic: "news",
        timeRange: "week",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        includeDomains: "a.com, b.com",
        includeDomainsMode: "prefer",
        excludeDomains: "c.com",
        language: "en",
        filterByLanguage: "true",
        safeSearch: "true",
      },
    });
    await new TavilyProvider(config).search("hello", 5, 1000);

    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.time_range).toBe("week");
    expect(body.start_date).toBe("2025-01-01");
    expect(body.end_date).toBe("2025-12-31");
    expect(body.include_domains).toEqual(["a.com", "b.com"]);
    expect(body.include_domains_mode).toBe("prefer");
    expect(body.exclude_domains).toEqual(["c.com"]);
    expect(body.language).toBe("en");
    expect(body.filter_by_language).toBe(true);
    expect(body.safe_search).toBe(true);
  });

  it("omits safe_search for fast search depths", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({ results: [] }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = tavilyProviderConfigSchema.parse({
      id: "p1",
      name: "Tavily",
      baseUrl: "https://api.tavily.test",
      apiKey: "tk",
      extra: { searchDepth: "fast", safeSearch: "true" },
    });
    await new TavilyProvider(config).search("q", 5, 1000);

    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.safe_search).toBeUndefined();
  });

  it("throws on a non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("", { status: 401 })),
    );
    const config = tavilyProviderConfigSchema.parse({
      id: "p1",
      name: "Tavily",
      baseUrl: "https://api.tavily.test",
      apiKey: "tk",
      extra: {},
    });
    await expect(new TavilyProvider(config).search("q", 5, 1000)).rejects.toThrow(
      "tavily http 401",
    );
  });
});

describe("ExaProvider", () => {
  it("sends the configured search options and maps results", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({
        results: [{ url: "https://a", title: "A", text: "a" }],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = exaProviderConfigSchema.parse({
      id: "p1",
      name: "Exa",
      baseUrl: "https://api.exa.test/",
      apiKey: "ek",
      extra: {
        type: "deep",
        category: "publication",
        includeDomains: "a.com, b.com",
        excludeDomains: "c.com",
        startPublishedDate: "2025-01-01",
        endPublishedDate: "2025-12-31",
        moderation: "true",
        maxAgeHours: "24",
      },
    });
    const results = await new ExaProvider(config).search("hello", 3, 1000);

    expect(results).toEqual([{ link: "https://a", title: "A", snippet: "a" }]);
    const call = fetchMock.mock.calls[0];
    expect(String(call?.[0])).toBe("https://api.exa.test/search");
    expect(call?.[1]?.headers).toMatchObject({ "x-api-key": "ek" });
    const body = JSON.parse(String(call?.[1]?.body));
    expect(body.numResults).toBe(3);
    expect(body.type).toBe("deep");
    expect(body.category).toBe("publication");
    expect(body.includeDomains).toEqual(["a.com", "b.com"]);
    expect(body.excludeDomains).toEqual(["c.com"]);
    expect(body.startPublishedDate).toBe("2025-01-01T00:00:00.000Z");
    expect(body.endPublishedDate).toBe("2025-12-31T23:59:59.999Z");
    expect(body.moderation).toBe(true);
    expect(body.contents.maxAgeHours).toBe(24);
  });

  it("omits options Exa does not support for the category or type", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({ results: [] }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = exaProviderConfigSchema.parse({
      id: "p1",
      name: "Exa",
      baseUrl: "https://api.exa.test",
      apiKey: "ek",
      extra: {
        type: "lite",
        category: "people",
        excludeDomains: "c.com",
        startPublishedDate: "2025-01-01",
        maxAgeHours: "24",
      },
    });
    await new ExaProvider(config).search("q", 5, 1000);

    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.excludeDomains).toBeUndefined();
    expect(body.startPublishedDate).toBeUndefined();
    expect(body.contents.maxAgeHours).toBeUndefined();
  });

  it("omits date filters for company", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({ results: [] }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = exaProviderConfigSchema.parse({
      id: "p1",
      name: "Exa",
      baseUrl: "https://api.exa.test",
      apiKey: "ek",
      extra: { category: "company", endPublishedDate: "2025-12-31" },
    });
    await new ExaProvider(config).search("q", 5, 1000);

    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.endPublishedDate).toBeUndefined();
  });

  it("throws on a non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("", { status: 403 })),
    );
    const config = exaProviderConfigSchema.parse({
      id: "p1",
      name: "Exa",
      baseUrl: "https://api.exa.test",
      apiKey: "ek",
      extra: {},
    });
    await expect(new ExaProvider(config).search("q", 5, 1000)).rejects.toThrow("exa http 403");
  });
});

describe("ParallelProvider", () => {
  it("sends the search request and maps excerpts", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({
        results: [
          { url: "https://a", title: "A", excerpts: ["a1", "a2"] },
          { title: "no url", excerpts: [] },
          { url: "https://b", title: null, excerpts: [] },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = parallelProviderConfigSchema.parse({
      id: "p1",
      name: "Parallel",
      baseUrl: "https://api.parallel.test/",
      apiKey: "pk",
      extra: {
        mode: "basic",
        includeDomains: "a.com, b.com",
        excludeDomains: "c.com",
        maxCharsPerResult: "1000",
        maxCharsTotal: "10000",
        afterDate: "2025-01-01",
        location: "jp",
      },
    });
    const results = await new ParallelProvider(config).search("hello", 2, 1000);

    expect(results).toEqual([
      { link: "https://a", title: "A", snippet: "a1\n\na2" },
      { link: "https://b", title: "", snippet: "" },
    ]);
    const call = fetchMock.mock.calls[0];
    expect(String(call?.[0])).toBe("https://api.parallel.test/v1/search");
    expect(call?.[1]?.headers).toMatchObject({ "x-api-key": "pk" });
    const body = JSON.parse(String(call?.[1]?.body));
    expect(body.objective).toBe("hello");
    expect(body.search_queries).toEqual(["hello"]);
    expect(body.mode).toBe("basic");
    expect(body.max_chars_total).toBe(10000);
    expect(body.advanced_settings).toEqual({
      max_results: 2,
      source_policy: {
        include_domains: ["a.com", "b.com"],
        after_date: "2025-01-01",
      },
      excerpt_settings: { max_chars_per_result: 1000 },
      location: "JP",
    });
  });

  it("omits the source policy when no domains are configured", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({ results: [] }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = parallelProviderConfigSchema.parse({
      id: "p1",
      name: "Parallel",
      baseUrl: "https://api.parallel.test",
      apiKey: "pk",
      extra: {},
    });
    await new ParallelProvider(config).search("q", 5, 1000);

    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.mode).toBe("advanced");
    expect(body.advanced_settings).toEqual({ max_results: 5 });
  });

  it("throws on a non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("", { status: 401 })),
    );
    const config = parallelProviderConfigSchema.parse({
      id: "p1",
      name: "Parallel",
      baseUrl: "https://api.parallel.test",
      apiKey: "pk",
      extra: {},
    });
    await expect(new ParallelProvider(config).search("q", 5, 1000)).rejects.toThrow(
      "parallel http 401",
    );
  });
});

describe("LinkupProvider", () => {
  it("sends search options and maps results", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({
        results: [
          { url: "https://a", name: "A", content: "a" },
          { name: "no url", content: "x" },
          { url: "https://b", name: "B", content: "b" },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = linkupProviderConfigSchema.parse({
      id: "p1",
      name: "Linkup",
      baseUrl: "https://api.linkup.test/",
      apiKey: "lk",
      extra: {
        depth: "deep",
        includeDomains: "a.com, b.com",
        excludeDomains: "c.com",
        fromDate: "2025-01-01",
        toDate: "2025-12-31",
      },
    });
    const results = await new LinkupProvider(config).search("hello", 2, 1000);

    expect(results).toEqual([
      { link: "https://a", title: "A", snippet: "a" },
      { link: "https://b", title: "B", snippet: "b" },
    ]);
    const call = fetchMock.mock.calls[0];
    expect(String(call?.[0])).toBe("https://api.linkup.test/v1/search");
    expect(call?.[1]?.headers).toMatchObject({ Authorization: "Bearer lk" });
    const body = JSON.parse(String(call?.[1]?.body));
    expect(body).toEqual({
      q: "hello",
      depth: "deep",
      outputType: "searchResults",
      maxResults: 2,
      includeDomains: ["a.com", "b.com"],
      excludeDomains: ["c.com"],
      fromDate: "2025-01-01",
      toDate: "2025-12-31",
    });
  });

  it("throws on a non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("", { status: 401 })),
    );
    const config = linkupProviderConfigSchema.parse({
      id: "p1",
      name: "Linkup",
      baseUrl: "https://api.linkup.test",
      apiKey: "lk",
      extra: {},
    });
    await expect(new LinkupProvider(config).search("q", 5, 1000)).rejects.toThrow(
      "linkup http 401",
    );
  });
});

describe("YoucomProvider", () => {
  it("sends search options and maps snippets", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({
        results: {
          web: [
            { url: "https://a", title: "A", snippets: ["a1", "a2"] },
            { url: "https://b", title: "B", description: "b" },
            { title: "no url" },
          ],
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = youcomProviderConfigSchema.parse({
      id: "p1",
      name: "You.com",
      baseUrl: "https://ydc-index.test/",
      apiKey: "yk",
      extra: {
        freshness: "week",
        country: "jp",
        language: "JA",
        safesearch: "strict",
        includeDomains: "a.com, b.com",
        excludeDomains: "c.com",
        strictOperators: "true",
      },
    });
    const results = await new YoucomProvider(config).search("hello", 2, 1000);

    expect(results).toEqual([
      { link: "https://a", title: "A", snippet: "a1\n\na2" },
      { link: "https://b", title: "B", snippet: "b" },
    ]);
    const call = fetchMock.mock.calls[0];
    expect(String(call?.[0])).toBe("https://ydc-index.test/v1/search");
    expect(call?.[1]?.headers).toMatchObject({ "X-API-Key": "yk" });
    const body = JSON.parse(String(call?.[1]?.body));
    expect(body).toEqual({
      query: "hello",
      count: 2,
      freshness: "week",
      country: "JP",
      language: "JA",
      safesearch: "strict",
      include_domains: ["a.com", "b.com"],
      strict_operators: true,
    });
    expect(body.exclude_domains).toBeUndefined();
  });

  it("sends exclude_domains when no include_domains are set", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({ results: { web: [] } }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = youcomProviderConfigSchema.parse({
      id: "p1",
      name: "You.com",
      baseUrl: "https://ydc-index.test",
      apiKey: "yk",
      extra: { excludeDomains: "c.com" },
    });
    await new YoucomProvider(config).search("q", 5, 1000);

    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.exclude_domains).toEqual(["c.com"]);
    expect(body.include_domains).toBeUndefined();
  });
});

describe("MwmblProvider", () => {
  it("maps results and sends the optional api key", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({
        results: [{ url: "https://a", title: "A", content: "a" }, { title: "no url" }],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = mwmblProviderConfigSchema.parse({
      id: "p1",
      name: "Mwmbl",
      baseUrl: "https://mwmbl.test/",
      apiKey: "mk",
      extra: {},
    });
    const results = await new MwmblProvider(config).search("hello", 2, 1000);

    expect(results).toEqual([{ link: "https://a", title: "A", snippet: "a" }]);
    const call = fetchMock.mock.calls[0];
    const url = new URL(String(call?.[0]));
    expect(url.pathname).toBe("/api/v2/search/");
    expect(url.searchParams.get("q")).toBe("hello");
    expect(call?.[1]?.headers).toMatchObject({ "X-API-Key": "mk" });
  });

  it("retries without the key when Mwmbl rejects it", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, init?: RequestInit) => {
      const headers = (init?.headers ?? {}) as Record<string, string>;
      if (headers["X-API-Key"]) {
        return new Response(JSON.stringify({ detail: "Invalid API key." }), { status: 401 });
      }
      return jsonResponse({ results: [{ url: "https://a", title: "A", content: "a" }] });
    });
    vi.stubGlobal("fetch", fetchMock);

    const config = mwmblProviderConfigSchema.parse({
      id: "p1",
      name: "Mwmbl",
      baseUrl: "https://mwmbl.test",
      apiKey: "invalid",
      extra: {},
    });
    const results = await new MwmblProvider(config).search("hello", 2, 1000);

    expect(results).toEqual([{ link: "https://a", title: "A", snippet: "a" }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const retryHeaders = (fetchMock.mock.calls[1]?.[1]?.headers ?? {}) as Record<string, string>;
    expect(retryHeaders["X-API-Key"]).toBeUndefined();
  });
});

describe("BraveProvider", () => {
  it("pages through results and maps extra snippets", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, _init?: RequestInit) => {
      const offset = new URL(String(input)).searchParams.get("offset");
      if (offset === "0") {
        return jsonResponse({
          web: {
            results: [
              { url: "https://a", title: "A", description: "a", extra_snippets: ["a2"] },
              { url: "https://b", title: "B", description: "b" },
            ],
          },
          query: { more_results_available: true },
        });
      }
      return jsonResponse({
        web: { results: [{ url: "https://c", title: "C", description: "c" }] },
        query: { more_results_available: false },
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const config = braveProviderConfigSchema.parse({
      id: "p1",
      name: "Brave",
      baseUrl: "https://api.search.brave.test/",
      apiKey: "bk",
      extra: {
        country: "jp",
        searchLang: "jp",
        uiLang: "ja-JP",
        safesearch: "strict",
        freshness: "pw",
        extraSnippets: "true",
      },
    });
    const results = await new BraveProvider(config).search("hello", 3, 1000);

    expect(results).toEqual([
      { link: "https://a", title: "A", snippet: "a\n\na2" },
      { link: "https://b", title: "B", snippet: "b" },
      { link: "https://c", title: "C", snippet: "c" },
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const first = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(first.pathname).toBe("/res/v1/web/search");
    expect(first.searchParams.get("count")).toBe("3");
    expect(first.searchParams.get("offset")).toBe("0");
    expect(first.searchParams.get("country")).toBe("JP");
    expect(first.searchParams.get("search_lang")).toBe("jp");
    expect(first.searchParams.get("ui_lang")).toBe("ja-JP");
    expect(first.searchParams.get("safesearch")).toBe("strict");
    expect(first.searchParams.get("freshness")).toBe("pw");
    expect(first.searchParams.get("extra_snippets")).toBe("true");
    expect(fetchMock.mock.calls[0]?.[1]?.headers).toMatchObject({
      "X-Subscription-Token": "bk",
    });
    const second = new URL(String(fetchMock.mock.calls[1]?.[0]));
    expect(second.searchParams.get("count")).toBe("1");
    expect(second.searchParams.get("offset")).toBe("1");
  });
});

describe("ApifyProvider", () => {
  it("runs the actor and flattens organic results", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse([
        {
          organicResults: [{ url: "https://a", title: "A", description: "a" }, { title: "no url" }],
        },
        { organicResults: [{ url: "https://b", title: "B", description: "b" }] },
      ]),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = apifyProviderConfigSchema.parse({
      id: "p1",
      name: "Apify",
      baseUrl: "https://api.apify.test/",
      apiKey: "ak",
      extra: {
        countryCode: "jp",
        languageCode: "ja",
        mobileResults: "true",
        quickDateRange: "d10",
        beforeDate: "2025-12-31",
        afterDate: "2025-01-01",
      },
    });
    const results = await new ApifyProvider(config).search("hello", 25, 1000);

    expect(results).toEqual([
      { link: "https://a", title: "A", snippet: "a" },
      { link: "https://b", title: "B", snippet: "b" },
    ]);
    const call = fetchMock.mock.calls[0];
    expect(String(call?.[0])).toBe(
      "https://api.apify.test/v2/actors/apify~google-search-scraper/run-sync-get-dataset-items?format=json&clean=1",
    );
    expect(call?.[1]?.headers).toMatchObject({ Authorization: "Bearer ak" });
    const body = JSON.parse(String(call?.[1]?.body));
    expect(body).toEqual({
      queries: "hello",
      maxPagesPerQuery: 3,
      countryCode: "JP",
      languageCode: "ja",
      mobileResults: true,
      quickDateRange: "d10",
      beforeDate: "2025-12-31",
      afterDate: "2025-01-01",
    });
  });
});

describe("SerpapiProvider", () => {
  it("sends query params and maps organic results", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({
        organic_results: [{ link: "https://a", title: "A", snippet: "a" }, { title: "no link" }],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = serpapiProviderConfigSchema.parse({
      id: "p1",
      name: "SerpApi",
      baseUrl: "https://serpapi.test/",
      apiKey: "sk",
      extra: {
        location: "Tokyo, Japan",
        gl: "JP",
        hl: "ja",
        googleDomain: "google.co.jp",
        device: "mobile",
        safe: "active",
        tbs: "qdr:w",
      },
    });
    const results = await new SerpapiProvider(config).search("hello", 5, 1000);

    expect(results).toEqual([{ link: "https://a", title: "A", snippet: "a" }]);
    const call = fetchMock.mock.calls[0];
    const url = new URL(String(call?.[0]));
    expect(url.pathname).toBe("/search.json");
    expect(url.searchParams.get("engine")).toBe("google");
    expect(url.searchParams.get("q")).toBe("hello");
    expect(url.searchParams.get("api_key")).toBe("sk");
    expect(url.searchParams.get("num")).toBe("5");
    expect(url.searchParams.get("location")).toBe("Tokyo, Japan");
    expect(url.searchParams.get("gl")).toBe("jp");
    expect(url.searchParams.get("hl")).toBe("ja");
    expect(url.searchParams.get("google_domain")).toBe("google.co.jp");
    expect(url.searchParams.get("device")).toBe("mobile");
    expect(url.searchParams.get("safe")).toBe("active");
    expect(url.searchParams.get("tbs")).toBe("qdr:w");
  });

  it("throws when SerpApi returns an error payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ error: "Invalid API key" })),
    );
    const config = serpapiProviderConfigSchema.parse({
      id: "p1",
      name: "SerpApi",
      baseUrl: "https://serpapi.test",
      apiKey: "sk",
      extra: {},
    });
    await expect(new SerpapiProvider(config).search("q", 5, 1000)).rejects.toThrow(
      "serpapi: Invalid API key",
    );
  });
});

describe("BrightdataProvider", () => {
  it("sends a Google search through the request endpoint and maps organic results", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({
        organic: [
          { link: "https://a", title: "A", description: "a" },
          { title: "no link" },
          { url: "https://b", title: "B", snippet: "b" },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = brightdataProviderConfigSchema.parse({
      id: "p1",
      name: "Bright Data",
      baseUrl: "https://api.brightdata.test/",
      apiKey: "bk",
      extra: { zone: "serp_api1", domain: "google.co.jp", gl: "JP", hl: "ja", safe: "active" },
    });
    const results = await new BrightdataProvider(config).search("hello", 5, 1000);

    expect(results).toEqual([
      { link: "https://a", title: "A", snippet: "a" },
      { link: "https://b", title: "B", snippet: "b" },
    ]);
    const call = fetchMock.mock.calls[0];
    expect(String(call?.[0])).toBe("https://api.brightdata.test/request");
    expect(call?.[1]?.method).toBe("POST");
    expect(call?.[1]?.headers).toMatchObject({
      "Content-Type": "application/json",
      Authorization: "Bearer bk",
    });
    const body = JSON.parse(String(call?.[1]?.body));
    expect(body.zone).toBe("serp_api1");
    expect(body.format).toBe("raw");
    expect(body.data_format).toBe("parsed_light");
    expect(body.country).toBe("jp");
    const url = new URL(body.url);
    expect(url.origin).toBe("https://www.google.co.jp");
    expect(url.searchParams.get("q")).toBe("hello");
    expect(url.searchParams.get("num")).toBe("5");
    expect(url.searchParams.get("gl")).toBe("jp");
    expect(url.searchParams.get("hl")).toBe("ja");
    expect(url.searchParams.get("safe")).toBe("active");
  });

  it("builds a Bing URL with Bing-specific parameters", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({
        webPages: {
          value: [{ url: "https://a", name: "A", snippet: "a" }],
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = brightdataProviderConfigSchema.parse({
      id: "p1",
      name: "Bright Data",
      baseUrl: "https://api.brightdata.test",
      apiKey: "bk",
      extra: { zone: "serp_api1", engine: "bing", gl: "US", hl: "en", safe: "active" },
    });
    const results = await new BrightdataProvider(config).search("hello", 100, 1000);

    expect(results).toEqual([{ link: "https://a", title: "A", snippet: "a" }]);
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.format).toBe("raw");
    expect(body.data_format).toBe("parsed_bing_api");
    const url = new URL(body.url);
    expect(url.origin).toBe("https://www.bing.com");
    expect(url.searchParams.get("q")).toBe("hello");
    expect(url.searchParams.get("count")).toBe("50");
    expect(url.searchParams.get("cc")).toBe("us");
    expect(url.searchParams.get("setlang")).toBe("en");
    expect(url.searchParams.get("adlt")).toBe("strict");
  });

  it("throws when the response is not a parsed SERP payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ status_code: 200, body: "<html></html>" })),
    );
    const config = brightdataProviderConfigSchema.parse({
      id: "p1",
      name: "Bright Data",
      baseUrl: "https://api.brightdata.test",
      apiKey: "bk",
      extra: { zone: "serp_api1" },
    });
    await expect(new BrightdataProvider(config).search("q", 5, 1000)).rejects.toThrow(
      "brightdata: unexpected response format",
    );
  });

  it("throws when Bright Data returns an error payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ error: "Invalid zone" })),
    );
    const config = brightdataProviderConfigSchema.parse({
      id: "p1",
      name: "Bright Data",
      baseUrl: "https://api.brightdata.test",
      apiKey: "bk",
      extra: { zone: "serp_api1" },
    });
    await expect(new BrightdataProvider(config).search("q", 5, 1000)).rejects.toThrow(
      "brightdata: Invalid zone",
    );
  });

  it("throws on a non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("Too many requests", { status: 429 })),
    );
    const config = brightdataProviderConfigSchema.parse({
      id: "p1",
      name: "Bright Data",
      baseUrl: "https://api.brightdata.test",
      apiKey: "bk",
      extra: { zone: "serp_api1" },
    });
    await expect(new BrightdataProvider(config).search("q", 5, 1000)).rejects.toThrow(
      "brightdata: Too many requests",
    );
  });
});

describe("ZenserpProvider", () => {
  it("sends query params and maps organic results", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({
        organic: [
          { url: "https://a", title: "A", description: "a" },
          { destination: "https://b", title: "B", description: "b" },
          { title: "no url" },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = zenserpProviderConfigSchema.parse({
      id: "p1",
      name: "Zenserp",
      baseUrl: "https://zenserp.test/",
      apiKey: "zk",
      extra: { engine: "bing", gl: "JP", hl: "ja", location: "Tokyo, Japan", device: "mobile" },
    });
    const results = await new ZenserpProvider(config).search("hello", 5, 1000);

    expect(results).toEqual([
      { link: "https://a", title: "A", snippet: "a" },
      { link: "https://b", title: "B", snippet: "b" },
    ]);
    const call = fetchMock.mock.calls[0];
    expect(call?.[1]?.headers).toMatchObject({ apikey: "zk" });
    const url = new URL(String(call?.[0]));
    expect(url.pathname).toBe("/api/v2/search");
    expect(url.searchParams.get("q")).toBe("hello");
    expect(url.searchParams.get("engine")).toBe("bing");
    expect(url.searchParams.get("num")).toBe("5");
    expect(url.searchParams.get("gl")).toBe("jp");
    expect(url.searchParams.get("hl")).toBe("ja");
    expect(url.searchParams.get("location")).toBe("Tokyo, Japan");
    expect(url.searchParams.get("device")).toBe("mobile");
  });

  it("throws when Zenserp returns an error payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ error: "Invalid apikey" })),
    );
    const config = zenserpProviderConfigSchema.parse({
      id: "p1",
      name: "Zenserp",
      baseUrl: "https://zenserp.test",
      apiKey: "zk",
      extra: {},
    });
    await expect(new ZenserpProvider(config).search("q", 5, 1000)).rejects.toThrow(
      "zenserp: Invalid apikey",
    );
  });
});

describe("FirecrawlProvider", () => {
  it("sends search options and maps web results", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({
        success: true,
        data: {
          web: [
            { url: "https://a", title: "A", description: "a" },
            { title: "no url" },
            { url: "https://b", title: "B", description: "b" },
          ],
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = firecrawlProviderConfigSchema.parse({
      id: "p1",
      name: "Firecrawl",
      baseUrl: "https://api.firecrawl.test/",
      apiKey: "fk",
      extra: {
        tbs: "qdr:w",
        location: "Tokyo,Japan",
        country: "jp",
        safe: "true",
        category: "pdf",
        includeDomains: "a.com, b.com",
        excludeDomains: "c.com",
      },
    });
    const results = await new FirecrawlProvider(config).search("hello", 2, 1000);

    expect(results).toEqual([
      { link: "https://a", title: "A", snippet: "a" },
      { link: "https://b", title: "B", snippet: "b" },
    ]);
    const call = fetchMock.mock.calls[0];
    expect(String(call?.[0])).toBe("https://api.firecrawl.test/v2/search");
    expect(call?.[1]?.headers).toMatchObject({ Authorization: "Bearer fk" });
    const body = JSON.parse(String(call?.[1]?.body));
    expect(body).toEqual({
      query: "hello",
      limit: 2,
      tbs: "qdr:w",
      location: "Tokyo,Japan",
      country: "JP",
      safe: true,
      categories: ["pdf"],
      includeDomains: ["a.com", "b.com"],
    });
    expect(body.excludeDomains).toBeUndefined();
  });

  it("omits the Authorization header when no key is set", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({ success: true, data: { web: [] } }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const config = firecrawlProviderConfigSchema.parse({
      id: "p1",
      name: "Firecrawl",
      baseUrl: "https://api.firecrawl.test",
      apiKey: "",
      extra: {},
    });
    await new FirecrawlProvider(config).search("q", 5, 1000);

    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Record<string, string>;
    expect(headers.Authorization).toBeUndefined();
  });

  it("supports the legacy data array response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ success: true, data: [{ url: "https://a", title: "A" }] })),
    );
    const config = firecrawlProviderConfigSchema.parse({
      id: "p1",
      name: "Firecrawl",
      baseUrl: "https://api.firecrawl.test",
      apiKey: "fk",
      extra: {},
    });
    const results = await new FirecrawlProvider(config).search("q", 5, 1000);
    expect(results).toEqual([{ link: "https://a", title: "A", snippet: "" }]);
  });

  it("throws when Firecrawl reports a failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ success: false, error: "Invalid API key" })),
    );
    const config = firecrawlProviderConfigSchema.parse({
      id: "p1",
      name: "Firecrawl",
      baseUrl: "https://api.firecrawl.test",
      apiKey: "fk",
      extra: {},
    });
    await expect(new FirecrawlProvider(config).search("q", 5, 1000)).rejects.toThrow(
      "firecrawl: Invalid API key",
    );
  });
});

describe("ScrapedoProvider", () => {
  it("sends search options and maps organic results", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({
        organic_results: [
          { title: "A", link: "https://a", snippet: "a" },
          { title: "no link" },
          { title: "B", link: "https://b", snippet: "b" },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = scrapedoProviderConfigSchema.parse({
      id: "p1",
      name: "Scrape.do",
      baseUrl: "https://api.scrape.do/",
      apiKey: "sdk",
      extra: {
        device: "mobile",
        gl: "JP",
        hl: "ja",
        googleDomain: "google.co.jp",
        location: "Tokyo,Tokyo,Japan",
        safe: "true",
        timePeriod: "last_week",
        resolveGoto: "true",
      },
    });
    const results = await new ScrapedoProvider(config).search("hello", 2, 60000);

    expect(results).toEqual([
      { link: "https://a", title: "A", snippet: "a" },
      { link: "https://b", title: "B", snippet: "b" },
    ]);
    const call = fetchMock.mock.calls[0];
    const url = new URL(String(call?.[0]));
    expect(url.pathname).toBe("/plugin/google/search");
    expect(url.searchParams.get("token")).toBe("sdk");
    expect(url.searchParams.get("q")).toBe("hello");
    expect(url.searchParams.get("start")).toBe("0");
    expect(url.searchParams.get("device")).toBe("mobile");
    expect(url.searchParams.get("gl")).toBe("jp");
    expect(url.searchParams.get("hl")).toBe("ja");
    expect(url.searchParams.get("google_domain")).toBe("google.co.jp");
    expect(url.searchParams.get("location")).toBe("Tokyo,Tokyo,Japan");
    expect(url.searchParams.get("safe")).toBe("active");
    expect(url.searchParams.get("time_period")).toBe("last_week");
    expect(url.searchParams.get("resolveGoto")).toBe("true");
  });

  it("omits resolveGoto when disabled", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({ organic_results: [] }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const config = scrapedoProviderConfigSchema.parse({
      id: "p1",
      name: "Scrape.do",
      baseUrl: "https://api.scrape.do",
      apiKey: "sdk",
      extra: { resolveGoto: "" },
    });
    await new ScrapedoProvider(config).search("q", 5, 60000);

    const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(url.searchParams.get("resolveGoto")).toBeNull();
  });

  it("surfaces the API error message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse(
          {
            StatusCode: 401,
            Message: ["Scrape.do API Token is inactive or incorrect."],
          },
          401,
        ),
      ),
    );
    const config = scrapedoProviderConfigSchema.parse({
      id: "p1",
      name: "Scrape.do",
      baseUrl: "https://api.scrape.do",
      apiKey: "sdk",
      extra: {},
    });
    await expect(new ScrapedoProvider(config).search("q", 5, 60000)).rejects.toThrow(
      "scrapedo: Scrape.do API Token is inactive or incorrect.",
    );
  });
});
