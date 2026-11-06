import { describe, expect, it } from "vitest";

import { youcomFormSchema, youcomProviderConfigSchema } from "./index";

const youcomForm = {
  id: "p1",
  type: "youcom",
  name: "You.com",
  baseUrl: "https://ydc-index.io",
  apiKey: "secret",
  enabled: "on",
  timeoutSec: "10",
  fallbackOnEmpty: "on",
  extra: {},
};

const youcomConfig = {
  id: "p1",
  name: "You.com",
  baseUrl: "https://ydc-index.io",
  apiKey: "secret",
  extra: {},
};

describe("youcom form schema", () => {
  it("applies provider-specific extra defaults", () => {
    expect(youcomFormSchema.parse(youcomForm).extra).toEqual({
      freshness: "",
      country: "",
      language: "",
      safesearch: "moderate",
      includeDomains: "",
      excludeDomains: "",
      strictOperators: "",
    });
  });

  it("rejects invalid freshness, safe search and country", () => {
    expect(
      youcomFormSchema.safeParse({ ...youcomForm, extra: { freshness: "hour" } }).success,
    ).toBe(false);
    expect(youcomFormSchema.safeParse({ ...youcomForm, extra: { safesearch: "on" } }).success).toBe(
      false,
    );
    expect(youcomFormSchema.safeParse({ ...youcomForm, extra: { country: "JPN" } }).success).toBe(
      false,
    );
  });

  it("uses the default base URL when blank", () => {
    expect(youcomFormSchema.parse({ ...youcomForm, baseUrl: "" }).baseUrl).toBe(
      "https://ydc-index.io",
    );
    expect(youcomProviderConfigSchema.parse({ ...youcomConfig, baseUrl: "" }).baseUrl).toBe(
      "https://ydc-index.io",
    );
  });
});
