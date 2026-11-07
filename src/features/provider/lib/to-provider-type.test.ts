import { describe, expect, it } from "vitest";

import { toProviderType } from "./to-provider-type";

describe("toProviderType", () => {
  it("returns the provider type for known values", () => {
    expect(toProviderType("searxng")).toBe("searxng");
    expect(toProviderType("exa")).toBe("exa");
    expect(toProviderType("tavily")).toBe("tavily");
    expect(toProviderType("parallel")).toBe("parallel");
    expect(toProviderType("linkup")).toBe("linkup");
    expect(toProviderType("youcom")).toBe("youcom");
    expect(toProviderType("mwmbl")).toBe("mwmbl");
    expect(toProviderType("brave")).toBe("brave");
    expect(toProviderType("apify")).toBe("apify");
    expect(toProviderType("serpapi")).toBe("serpapi");
    expect(toProviderType("zenserp")).toBe("zenserp");
    expect(toProviderType("firecrawl")).toBe("firecrawl");
    expect(toProviderType("scrapedo")).toBe("scrapedo");
    expect(toProviderType("brightdata")).toBe("brightdata");
  });

  it("returns null for unknown values", () => {
    expect(toProviderType("unknown")).toBeNull();
    expect(toProviderType(undefined)).toBeNull();
    expect(toProviderType(null)).toBeNull();
    expect(toProviderType(1)).toBeNull();
  });
});
