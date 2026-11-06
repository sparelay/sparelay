import { describe, expect, it } from "vitest";

import { mwmblFormSchema, mwmblProviderConfigSchema } from "./index";

const mwmblForm = {
  id: "p1",
  type: "mwmbl",
  name: "Mwmbl",
  baseUrl: "https://mwmbl.org",
  apiKey: "",
  enabled: "on",
  timeoutSec: "10",
  fallbackOnEmpty: "on",
  extra: {},
};

const mwmblConfig = {
  id: "p1",
  name: "Mwmbl",
  baseUrl: "https://mwmbl.org",
  apiKey: "",
  extra: {},
};

describe("mwmbl form schema", () => {
  it("accepts an empty extra object", () => {
    expect(mwmblFormSchema.parse(mwmblForm).extra).toEqual({});
  });

  it("defaults extra when the form omits it", () => {
    const withoutExtra: Record<string, unknown> = { ...mwmblForm };
    delete withoutExtra.extra;
    expect(mwmblFormSchema.parse(withoutExtra).extra).toEqual({});
  });

  it("does not require an API key", () => {
    expect(mwmblFormSchema.safeParse(mwmblForm).success).toBe(true);
    expect(mwmblProviderConfigSchema.safeParse(mwmblConfig).success).toBe(true);
  });

  it("uses the default base URL when blank", () => {
    expect(mwmblFormSchema.parse({ ...mwmblForm, baseUrl: "" }).baseUrl).toBe("https://mwmbl.org");
  });
});
