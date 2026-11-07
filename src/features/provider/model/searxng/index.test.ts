import { describe, expect, it } from "vitest";

import { searxngFormSchema, searxngProviderConfigSchema } from "./index";

const searxngForm = {
  id: "p1",
  type: "searxng",
  name: "SearXNG",
  baseUrl: "https://searx.example.com",
  apiKey: "",
  enabled: "on",
  timeoutSec: "",
  fallbackOnEmpty: "on",
  extra: {},
};

const searxngConfig = {
  id: "p1",
  name: "SearXNG",
  baseUrl: "https://searx.example.com",
  apiKey: "",
  extra: {},
};

describe("searxng form schema", () => {
  it("applies defaults", () => {
    const parsed = searxngFormSchema.parse(searxngForm);
    expect(parsed.enabled).toBe(true);
    expect(parsed.timeoutSec).toBe(5);
    expect(parsed.extra).toEqual({
      language: "",
      categories: "",
      timeRange: "",
      safesearch: "",
    });
  });

  it("rejects an invalid time range and safe search value", () => {
    expect(
      searxngFormSchema.safeParse({ ...searxngForm, extra: { timeRange: "hour" } }).success,
    ).toBe(false);
    expect(
      searxngFormSchema.safeParse({ ...searxngForm, extra: { safesearch: "3" } }).success,
    ).toBe(false);
  });

  it("requires a base URL because SearXNG has no default", () => {
    expect(searxngFormSchema.safeParse({ ...searxngForm, baseUrl: "" }).success).toBe(false);
    expect(searxngProviderConfigSchema.safeParse({ ...searxngConfig, baseUrl: "" }).success).toBe(
      false,
    );
  });
});

describe("searxng provider config schema", () => {
  it("accepts an empty API key", () => {
    const parsed = searxngProviderConfigSchema.parse(searxngConfig);
    expect(parsed.apiKey).toBe("");
    expect(Object.keys(parsed).sort()).toEqual(["apiKey", "baseUrl", "extra", "id", "name"]);
  });

  it("rejects unknown extra keys", () => {
    expect(
      searxngProviderConfigSchema.safeParse({
        ...searxngConfig,
        extra: { language: "ja", unknown: true },
      }).success,
    ).toBe(false);
  });
});
