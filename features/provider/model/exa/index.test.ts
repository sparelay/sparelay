import { describe, expect, it } from "vitest";

import { exaFormSchema, exaProviderConfigSchema } from "./index";

const exaForm = {
  id: "p2",
  type: "exa",
  name: "Exa",
  baseUrl: "https://api.exa.ai",
  apiKey: "secret",
  enabled: "on",
  timeoutSec: "10",
  fallbackOnEmpty: "on",
  extra: {},
};

const exaConfig = {
  id: "p2",
  name: "Exa",
  baseUrl: "https://api.exa.ai",
  apiKey: "secret",
  extra: {},
};

describe("exa form schema", () => {
  it("applies provider-specific extra defaults", () => {
    const parsed = exaFormSchema.parse(exaForm);
    expect(parsed.extra).toEqual({
      type: "auto",
      category: "",
      includeDomains: "",
      excludeDomains: "",
      startPublishedDate: "",
      endPublishedDate: "",
      moderation: "",
      maxAgeHours: "",
    });
  });

  it("rejects legacy search methods and categories", () => {
    expect(exaFormSchema.safeParse({ ...exaForm, extra: { type: "neural" } }).success).toBe(false);
    expect(exaFormSchema.safeParse({ ...exaForm, extra: { type: "instant" } }).success).toBe(false);
    expect(exaFormSchema.safeParse({ ...exaForm, extra: { type: "fast" } }).success).toBe(false);
    expect(
      exaFormSchema.safeParse({ ...exaForm, extra: { category: "research paper" } }).success,
    ).toBe(false);
    expect(exaFormSchema.safeParse({ ...exaForm, extra: { category: "pdf" } }).success).toBe(false);
  });

  it("validates dates and max age hours", () => {
    expect(
      exaFormSchema.safeParse({
        ...exaForm,
        extra: { startPublishedDate: "2025/01/01" },
      }).success,
    ).toBe(false);
    expect(
      exaFormSchema.safeParse({
        ...exaForm,
        extra: { startPublishedDate: "2025-02-30" },
      }).success,
    ).toBe(false);
    expect(exaFormSchema.safeParse({ ...exaForm, extra: { maxAgeHours: "721" } }).success).toBe(
      false,
    );
    expect(exaFormSchema.safeParse({ ...exaForm, extra: { maxAgeHours: "-2" } }).success).toBe(
      false,
    );
  });

  it("uses the default base URL when omitted", () => {
    expect(exaFormSchema.parse({ ...exaForm, baseUrl: undefined }).baseUrl).toBe(
      "https://api.exa.ai",
    );
    expect(exaProviderConfigSchema.parse({ ...exaConfig, baseUrl: undefined }).baseUrl).toBe(
      "https://api.exa.ai",
    );
  });
});

describe("exa provider config schema", () => {
  it("requires an API key", () => {
    expect(exaProviderConfigSchema.safeParse({ ...exaConfig, apiKey: "" }).success).toBe(false);
  });

  it("strips form-only fields", () => {
    const parsed = exaProviderConfigSchema.parse({
      ...exaConfig,
      type: "exa",
      enabled: true,
      timeoutSec: 10,
      fallbackOnEmpty: true,
    });
    expect(Object.keys(parsed).sort()).toEqual(["apiKey", "baseUrl", "extra", "id", "name"]);
  });
});
