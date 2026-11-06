import { describe, expect, it } from "vitest";

import { PROVIDER_REGISTRY, providerDefaultBaseUrl, providerTypeSchema } from "./provider";

describe("providerTypeSchema", () => {
  it("accepts registry keys", () => {
    expect(providerTypeSchema.safeParse("searxng").success).toBe(true);
    expect(providerTypeSchema.safeParse("exa").success).toBe(true);
    expect(providerTypeSchema.safeParse("tavily").success).toBe(true);
    expect(providerTypeSchema.safeParse("parallel").success).toBe(true);
    expect(providerTypeSchema.safeParse("linkup").success).toBe(true);
    expect(providerTypeSchema.safeParse("youcom").success).toBe(true);
    expect(providerTypeSchema.safeParse("mwmbl").success).toBe(true);
    expect(providerTypeSchema.safeParse("brave").success).toBe(true);
    expect(providerTypeSchema.safeParse("apify").success).toBe(true);
    expect(providerTypeSchema.safeParse("serpapi").success).toBe(true);
    expect(providerTypeSchema.safeParse("zenserp").success).toBe(true);
    expect(providerTypeSchema.safeParse("firecrawl").success).toBe(true);
    expect(providerTypeSchema.safeParse("scrapedo").success).toBe(true);
  });

  it("rejects unknown values", () => {
    expect(providerTypeSchema.safeParse("unknown").success).toBe(false);
    expect(providerTypeSchema.safeParse("").success).toBe(false);
    expect(providerTypeSchema.safeParse(null).success).toBe(false);
  });
});

describe("providerDefaultBaseUrl", () => {
  it("reads the default from each provider schema", () => {
    expect(providerDefaultBaseUrl("exa")).toBe("https://api.exa.ai");
    expect(providerDefaultBaseUrl("tavily")).toBe("https://api.tavily.com");
    expect(providerDefaultBaseUrl("parallel")).toBe("https://api.parallel.ai");
    expect(providerDefaultBaseUrl("linkup")).toBe("https://api.linkup.so");
    expect(providerDefaultBaseUrl("youcom")).toBe("https://ydc-index.io");
    expect(providerDefaultBaseUrl("mwmbl")).toBe("https://mwmbl.org");
    expect(providerDefaultBaseUrl("brave")).toBe("https://api.search.brave.com");
    expect(providerDefaultBaseUrl("apify")).toBe("https://api.apify.com");
    expect(providerDefaultBaseUrl("serpapi")).toBe("https://serpapi.com");
    expect(providerDefaultBaseUrl("zenserp")).toBe("https://app.zenserp.com");
    expect(providerDefaultBaseUrl("firecrawl")).toBe("https://api.firecrawl.dev");
    expect(providerDefaultBaseUrl("scrapedo")).toBe("https://api.scrape.do");
    expect(providerDefaultBaseUrl("searxng")).toBeUndefined();
  });
});

describe("PROVIDER_REGISTRY", () => {
  it("exposes a label and icon for every provider", () => {
    for (const entry of Object.values(PROVIDER_REGISTRY)) {
      expect(entry.label.length).toBeGreaterThan(0);
      expect(entry.icon.light.length).toBeGreaterThan(0);
    }
  });

  it("defines a matching type literal for every provider", () => {
    for (const [key, entry] of Object.entries(PROVIDER_REGISTRY)) {
      const typeSchema = entry.schema.add.shape.type;
      expect(typeSchema.safeParse(key).success).toBe(true);
      expect(typeSchema.safeParse(`not-${key}`).success).toBe(false);
    }
  });

  it("omits id from the add schema but requires it for edit", () => {
    const base = {
      type: "searxng",
      name: "SearXNG",
      baseUrl: "https://searx.example.com",
      apiKey: "",
      enabled: "on",
      timeoutSec: "5",
      fallbackOnEmpty: "on",
      extra: {},
    };
    expect(PROVIDER_REGISTRY.searxng.schema.add.safeParse(base).success).toBe(true);
    expect(PROVIDER_REGISTRY.searxng.schema.edit.safeParse(base).success).toBe(false);
    expect(PROVIDER_REGISTRY.searxng.schema.edit.safeParse({ ...base, id: "p1" }).success).toBe(
      true,
    );
  });
});
