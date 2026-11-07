import { describe, expect, it } from "vitest";

import { firecrawlFormSchema, firecrawlProviderConfigSchema } from "./index";

const firecrawlForm = {
  id: "p1",
  type: "firecrawl",
  name: "Firecrawl",
  baseUrl: "https://api.firecrawl.dev",
  apiKey: "secret",
  enabled: "on",
  timeoutSec: "10",
  fallbackOnEmpty: "on",
  extra: {},
};

const firecrawlConfig = {
  id: "p1",
  name: "Firecrawl",
  baseUrl: "https://api.firecrawl.dev",
  apiKey: "secret",
  extra: {},
};

describe("firecrawl form schema", () => {
  it("applies provider-specific extra defaults", () => {
    expect(firecrawlFormSchema.parse(firecrawlForm).extra).toEqual({
      tbs: "",
      location: "",
      country: "",
      safe: "",
      category: "",
      includeDomains: "",
      excludeDomains: "",
    });
  });

  it("does not require an API key", () => {
    expect(firecrawlFormSchema.safeParse({ ...firecrawlForm, apiKey: "" }).success).toBe(true);
    expect(
      firecrawlProviderConfigSchema.safeParse({ ...firecrawlConfig, apiKey: "" }).success,
    ).toBe(true);
  });

  it("rejects an invalid category and country", () => {
    expect(
      firecrawlFormSchema.safeParse({ ...firecrawlForm, extra: { category: "research" } }).success,
    ).toBe(false);
    expect(
      firecrawlFormSchema.safeParse({ ...firecrawlForm, extra: { country: "JPN" } }).success,
    ).toBe(false);
  });

  it("uses the default base URL when omitted", () => {
    expect(firecrawlFormSchema.parse({ ...firecrawlForm, baseUrl: undefined }).baseUrl).toBe(
      "https://api.firecrawl.dev",
    );
    expect(
      firecrawlProviderConfigSchema.parse({ ...firecrawlConfig, baseUrl: undefined }).baseUrl,
    ).toBe("https://api.firecrawl.dev");
  });
});
