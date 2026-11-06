import { describe, expect, it } from "vitest";

import { scrapedoFormSchema, scrapedoProviderConfigSchema } from "./index";

const scrapedoForm = {
  id: "p1",
  type: "scrapedo",
  name: "Scrape.do",
  baseUrl: "https://api.scrape.do",
  apiKey: "secret",
  enabled: "on",
  timeoutSec: "60",
  fallbackOnEmpty: "on",
  extra: {},
};

const scrapedoConfig = {
  id: "p1",
  name: "Scrape.do",
  baseUrl: "https://api.scrape.do",
  apiKey: "secret",
  extra: {},
};

describe("scrapedo form schema", () => {
  it("applies provider-specific extra defaults", () => {
    expect(scrapedoFormSchema.parse(scrapedoForm).extra).toEqual({
      device: "desktop",
      gl: "",
      hl: "",
      googleDomain: "",
      location: "",
      safe: "",
      timePeriod: "",
      resolveGoto: "true",
    });
  });

  it("defaults the timeout to 60 seconds", () => {
    expect(scrapedoFormSchema.parse({ ...scrapedoForm, timeoutSec: "" }).timeoutSec).toBe(60);
  });

  it("rejects invalid options", () => {
    expect(
      scrapedoFormSchema.safeParse({ ...scrapedoForm, extra: { device: "tablet" } }).success,
    ).toBe(false);
    expect(
      scrapedoFormSchema.safeParse({ ...scrapedoForm, extra: { timePeriod: "last_decade" } })
        .success,
    ).toBe(false);
    expect(scrapedoFormSchema.safeParse({ ...scrapedoForm, extra: { gl: "JPN" } }).success).toBe(
      false,
    );
  });

  it("uses the default base URL when blank", () => {
    expect(scrapedoFormSchema.parse({ ...scrapedoForm, baseUrl: "" }).baseUrl).toBe(
      "https://api.scrape.do",
    );
    expect(scrapedoProviderConfigSchema.parse({ ...scrapedoConfig, baseUrl: "" }).baseUrl).toBe(
      "https://api.scrape.do",
    );
  });
});
