import { describe, expect, it } from "vitest";

import { linkupFormSchema, linkupProviderConfigSchema } from "./index";

const linkupForm = {
  id: "p1",
  type: "linkup",
  name: "Linkup",
  baseUrl: "https://api.linkup.so",
  apiKey: "secret",
  enabled: "on",
  timeoutSec: "10",
  fallbackOnEmpty: "on",
  extra: {},
};

const linkupConfig = {
  id: "p1",
  name: "Linkup",
  baseUrl: "https://api.linkup.so",
  apiKey: "secret",
  extra: {},
};

describe("linkup form schema", () => {
  it("applies provider-specific extra defaults", () => {
    expect(linkupFormSchema.parse(linkupForm).extra).toEqual({
      depth: "fast",
      includeDomains: "",
      excludeDomains: "",
      fromDate: "",
      toDate: "",
    });
  });

  it("rejects an invalid depth and date", () => {
    expect(linkupFormSchema.safeParse({ ...linkupForm, extra: { depth: "turbo" } }).success).toBe(
      false,
    );
    expect(
      linkupFormSchema.safeParse({ ...linkupForm, extra: { fromDate: "2025/01/01" } }).success,
    ).toBe(false);
  });

  it("uses the default base URL when blank", () => {
    expect(linkupFormSchema.parse({ ...linkupForm, baseUrl: "" }).baseUrl).toBe(
      "https://api.linkup.so",
    );
    expect(linkupProviderConfigSchema.parse({ ...linkupConfig, baseUrl: "" }).baseUrl).toBe(
      "https://api.linkup.so",
    );
  });
});
