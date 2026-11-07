import { describe, expect, it } from "vitest";

import { zenserpFormSchema, zenserpProviderConfigSchema } from "./index";

const zenserpForm = {
  id: "p1",
  type: "zenserp",
  name: "Zenserp",
  baseUrl: "https://app.zenserp.com",
  apiKey: "secret",
  enabled: "on",
  timeoutSec: "10",
  fallbackOnEmpty: "on",
  extra: {},
};

const zenserpConfig = {
  id: "p1",
  name: "Zenserp",
  baseUrl: "https://app.zenserp.com",
  apiKey: "secret",
  extra: {},
};

describe("zenserp form schema", () => {
  it("applies provider-specific extra defaults", () => {
    expect(zenserpFormSchema.parse(zenserpForm).extra).toEqual({
      engine: "google",
      gl: "",
      hl: "",
      location: "",
      device: "desktop",
    });
  });

  it("rejects an invalid engine and device", () => {
    expect(
      zenserpFormSchema.safeParse({ ...zenserpForm, extra: { engine: "duckduckgo" } }).success,
    ).toBe(false);
    expect(
      zenserpFormSchema.safeParse({ ...zenserpForm, extra: { device: "phone" } }).success,
    ).toBe(false);
  });

  it("uses the default base URL when omitted", () => {
    expect(zenserpFormSchema.parse({ ...zenserpForm, baseUrl: undefined }).baseUrl).toBe(
      "https://app.zenserp.com",
    );
    expect(
      zenserpProviderConfigSchema.parse({ ...zenserpConfig, baseUrl: undefined }).baseUrl,
    ).toBe("https://app.zenserp.com");
  });
});
