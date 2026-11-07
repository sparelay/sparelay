import { describe, expect, it } from "vitest";

import { parallelFormSchema, parallelProviderConfigSchema } from "./index";

const parallelForm = {
  id: "p4",
  type: "parallel",
  name: "Parallel",
  baseUrl: "https://api.parallel.ai",
  apiKey: "secret",
  enabled: "on",
  timeoutSec: "10",
  fallbackOnEmpty: "on",
  extra: {},
};

const parallelConfig = {
  id: "p4",
  name: "Parallel",
  baseUrl: "https://api.parallel.ai",
  apiKey: "secret",
  extra: {},
};

describe("parallel form schema", () => {
  it("applies provider-specific extra defaults", () => {
    const parsed = parallelFormSchema.parse(parallelForm);
    expect(parsed.extra).toEqual({
      mode: "advanced",
      includeDomains: "",
      excludeDomains: "",
      maxCharsPerResult: "",
      maxCharsTotal: "",
      afterDate: "",
      location: "",
    });
  });

  it("rejects an invalid search mode, location and max chars", () => {
    expect(parallelFormSchema.safeParse({ ...parallelForm, extra: { mode: "slow" } }).success).toBe(
      false,
    );
    expect(
      parallelFormSchema.safeParse({ ...parallelForm, extra: { location: "JPN" } }).success,
    ).toBe(false);
    expect(
      parallelFormSchema.safeParse({ ...parallelForm, extra: { maxCharsTotal: "0" } }).success,
    ).toBe(false);
  });

  it("uses the default base URL when omitted", () => {
    expect(parallelFormSchema.parse({ ...parallelForm, baseUrl: undefined }).baseUrl).toBe(
      "https://api.parallel.ai",
    );
    expect(
      parallelProviderConfigSchema.parse({ ...parallelConfig, baseUrl: undefined }).baseUrl,
    ).toBe("https://api.parallel.ai");
  });
});

describe("parallel provider config schema", () => {
  it("requires an API key", () => {
    expect(parallelProviderConfigSchema.safeParse({ ...parallelConfig, apiKey: "" }).success).toBe(
      false,
    );
  });
});
