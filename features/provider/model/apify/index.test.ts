import { describe, expect, it } from "vitest";

import { apifyFormSchema, apifyProviderConfigSchema } from "./index";

const apifyForm = {
  id: "p1",
  type: "apify",
  name: "Apify",
  baseUrl: "https://api.apify.com",
  apiKey: "secret",
  enabled: "on",
  timeoutSec: "10",
  fallbackOnEmpty: "on",
  extra: {},
};

const apifyConfig = {
  id: "p1",
  name: "Apify",
  baseUrl: "https://api.apify.com",
  apiKey: "secret",
  extra: {},
};

describe("apify form schema", () => {
  it("applies provider-specific extra defaults", () => {
    expect(apifyFormSchema.parse(apifyForm).extra).toEqual({
      actorId: "apify~google-search-scraper",
      countryCode: "",
      languageCode: "",
      mobileResults: "",
      quickDateRange: "",
      beforeDate: "",
      afterDate: "",
    });
  });

  it("defaults the timeout to 25 seconds", () => {
    expect(apifyFormSchema.parse({ ...apifyForm, timeoutSec: "" }).timeoutSec).toBe(25);
  });

  it("rejects an empty actor id and invalid date", () => {
    expect(apifyFormSchema.safeParse({ ...apifyForm, extra: { actorId: "" } }).success).toBe(false);
    expect(
      apifyFormSchema.safeParse({ ...apifyForm, extra: { afterDate: "2025/01/01" } }).success,
    ).toBe(false);
  });

  it("uses the default base URL when blank", () => {
    expect(apifyFormSchema.parse({ ...apifyForm, baseUrl: "" }).baseUrl).toBe(
      "https://api.apify.com",
    );
    expect(apifyProviderConfigSchema.parse({ ...apifyConfig, baseUrl: "" }).baseUrl).toBe(
      "https://api.apify.com",
    );
  });
});
