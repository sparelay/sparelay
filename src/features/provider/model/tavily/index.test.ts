import { describe, expect, it } from "vitest";

import { tavilyFormSchema, tavilyProviderConfigSchema } from "./index";

const tavilyForm = {
  id: "p3",
  type: "tavily",
  name: "Tavily",
  baseUrl: "https://api.tavily.com",
  apiKey: "secret",
  enabled: "on",
  timeoutSec: "10",
  fallbackOnEmpty: "on",
  extra: {},
};

const tavilyConfig = {
  id: "p3",
  name: "Tavily",
  baseUrl: "https://api.tavily.com",
  apiKey: "secret",
  extra: {},
};

describe("tavily form schema", () => {
  it("applies provider-specific extra defaults", () => {
    const parsed = tavilyFormSchema.parse(tavilyForm);
    expect(parsed.extra).toEqual({
      searchDepth: "basic",
      topic: "general",
      timeRange: "",
      includeDomains: "",
      excludeDomains: "",
      includeDomainsMode: "restrict",
      startDate: "",
      endDate: "",
      language: "",
      filterByLanguage: "",
      safeSearch: "",
    });
  });

  it("rejects an invalid time range and date", () => {
    expect(
      tavilyFormSchema.safeParse({ ...tavilyForm, extra: { timeRange: "hour" } }).success,
    ).toBe(false);
    expect(
      tavilyFormSchema.safeParse({ ...tavilyForm, extra: { startDate: "2025/01/01" } }).success,
    ).toBe(false);
  });

  it("uses the default base URL when omitted", () => {
    expect(tavilyFormSchema.parse({ ...tavilyForm, baseUrl: undefined }).baseUrl).toBe(
      "https://api.tavily.com",
    );
    expect(tavilyProviderConfigSchema.parse({ ...tavilyConfig, baseUrl: undefined }).baseUrl).toBe(
      "https://api.tavily.com",
    );
  });
});

describe("tavily provider config schema", () => {
  it("requires an API key", () => {
    expect(tavilyProviderConfigSchema.safeParse({ ...tavilyConfig, apiKey: "" }).success).toBe(
      false,
    );
  });
});
