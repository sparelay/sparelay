import { describe, expect, it } from "vitest";

import { braveFormSchema, braveProviderConfigSchema } from "./index";

const braveForm = {
  id: "p1",
  type: "brave",
  name: "Brave",
  baseUrl: "https://api.search.brave.com",
  apiKey: "secret",
  enabled: "on",
  timeoutSec: "10",
  fallbackOnEmpty: "on",
  extra: {},
};

const braveConfig = {
  id: "p1",
  name: "Brave",
  baseUrl: "https://api.search.brave.com",
  apiKey: "secret",
  extra: {},
};

describe("brave form schema", () => {
  it("applies provider-specific extra defaults", () => {
    expect(braveFormSchema.parse(braveForm).extra).toEqual({
      country: "",
      searchLang: "",
      uiLang: "",
      safesearch: "moderate",
      freshness: "",
      extraSnippets: "",
    });
  });

  it("rejects invalid freshness and safe search", () => {
    expect(braveFormSchema.safeParse({ ...braveForm, extra: { freshness: "day" } }).success).toBe(
      false,
    );
    expect(braveFormSchema.safeParse({ ...braveForm, extra: { safesearch: "on" } }).success).toBe(
      false,
    );
  });

  it("uses the default base URL when blank", () => {
    expect(braveFormSchema.parse({ ...braveForm, baseUrl: "" }).baseUrl).toBe(
      "https://api.search.brave.com",
    );
    expect(braveProviderConfigSchema.parse({ ...braveConfig, baseUrl: "" }).baseUrl).toBe(
      "https://api.search.brave.com",
    );
  });
});
