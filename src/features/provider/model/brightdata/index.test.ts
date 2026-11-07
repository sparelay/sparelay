import { describe, expect, it } from "vitest";

import { brightdataFormSchema, brightdataProviderConfigSchema } from "./index";

const brightdataForm = {
  id: "p1",
  type: "brightdata",
  name: "Bright Data",
  baseUrl: "https://api.brightdata.com",
  apiKey: "secret",
  enabled: "on",
  timeoutSec: "10",
  fallbackOnEmpty: "on",
  extra: { zone: "serp_api1" },
};

const brightdataConfig = {
  id: "p1",
  name: "Bright Data",
  baseUrl: "https://api.brightdata.com",
  apiKey: "secret",
  extra: { zone: "serp_api1" },
};

describe("brightdata form schema", () => {
  it("applies provider-specific extra defaults", () => {
    expect(brightdataFormSchema.parse(brightdataForm).extra).toEqual({
      zone: "serp_api1",
      engine: "google",
      domain: "google.com",
      gl: "",
      hl: "",
      safe: "",
    });
  });

  it("requires a zone and rejects invalid options", () => {
    expect(brightdataFormSchema.safeParse({ ...brightdataForm, extra: {} }).success).toBe(false);
    expect(
      brightdataFormSchema.safeParse({ ...brightdataForm, extra: { zone: "a", engine: "yandex" } })
        .success,
    ).toBe(false);
    expect(
      brightdataFormSchema.safeParse({ ...brightdataForm, extra: { zone: "a", safe: "strict" } })
        .success,
    ).toBe(false);
    expect(
      brightdataFormSchema.safeParse({
        ...brightdataForm,
        extra: { zone: "a", domain: "not a domain" },
      }).success,
    ).toBe(false);
  });

  it("uses the default base URL when omitted", () => {
    expect(brightdataFormSchema.parse({ ...brightdataForm, baseUrl: undefined }).baseUrl).toBe(
      "https://api.brightdata.com",
    );
    expect(
      brightdataProviderConfigSchema.parse({ ...brightdataConfig, baseUrl: undefined }).baseUrl,
    ).toBe("https://api.brightdata.com");
  });

  it("defaults to a 30 second timeout", () => {
    expect(brightdataFormSchema.parse({ ...brightdataForm, timeoutSec: "" }).timeoutSec).toBe(30);
  });
});
