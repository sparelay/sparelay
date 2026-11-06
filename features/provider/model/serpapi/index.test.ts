import { describe, expect, it } from "vitest";

import { serpapiFormSchema, serpapiProviderConfigSchema } from "./index";

const serpapiForm = {
  id: "p1",
  type: "serpapi",
  name: "SerpApi",
  baseUrl: "https://serpapi.com",
  apiKey: "secret",
  enabled: "on",
  timeoutSec: "10",
  fallbackOnEmpty: "on",
  extra: {},
};

const serpapiConfig = {
  id: "p1",
  name: "SerpApi",
  baseUrl: "https://serpapi.com",
  apiKey: "secret",
  extra: {},
};

describe("serpapi form schema", () => {
  it("applies provider-specific extra defaults", () => {
    expect(serpapiFormSchema.parse(serpapiForm).extra).toEqual({
      location: "",
      gl: "",
      hl: "",
      googleDomain: "",
      device: "desktop",
      safe: "",
      tbs: "",
    });
  });

  it("rejects an invalid device and safe search", () => {
    expect(
      serpapiFormSchema.safeParse({ ...serpapiForm, extra: { device: "phone" } }).success,
    ).toBe(false);
    expect(serpapiFormSchema.safeParse({ ...serpapiForm, extra: { safe: "strict" } }).success).toBe(
      false,
    );
  });

  it("uses the default base URL when blank", () => {
    expect(serpapiFormSchema.parse({ ...serpapiForm, baseUrl: "" }).baseUrl).toBe(
      "https://serpapi.com",
    );
    expect(serpapiProviderConfigSchema.parse({ ...serpapiConfig, baseUrl: "" }).baseUrl).toBe(
      "https://serpapi.com",
    );
  });
});
