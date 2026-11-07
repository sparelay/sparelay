import { describe, expect, it } from "vitest";

import { commonFieldsSchema } from "./index";

const commonForm = {
  id: "p1",
  name: "Example",
  baseUrl: "https://example.com",
  apiKey: "secret",
  enabled: "on",
  timeoutSec: "",
  fallbackOnEmpty: "on",
  extra: {},
};

describe("common form fields", () => {
  it("applies defaults", () => {
    const parsed = commonFieldsSchema.parse(commonForm);
    expect(parsed.enabled).toBe(true);
    expect(parsed.timeoutSec).toBe(5);
    expect(parsed.cooldown).toBe(60);
  });

  it("rejects an empty name", () => {
    expect(commonFieldsSchema.safeParse({ ...commonForm, name: "" }).success).toBe(false);
  });

  it("rejects an invalid base URL", () => {
    expect(commonFieldsSchema.safeParse({ ...commonForm, baseUrl: "not a url" }).success).toBe(
      false,
    );
  });

  it("rejects a cooldown outside 0..86400", () => {
    expect(commonFieldsSchema.safeParse({ ...commonForm, cooldown: "-1" }).success).toBe(false);
    expect(commonFieldsSchema.safeParse({ ...commonForm, cooldown: "0" }).success).toBe(true);
    expect(commonFieldsSchema.safeParse({ ...commonForm, cooldown: "86400" }).success).toBe(true);
    expect(commonFieldsSchema.safeParse({ ...commonForm, cooldown: "86401" }).success).toBe(false);
  });

  it("rejects a timeout outside 1..60", () => {
    expect(commonFieldsSchema.safeParse({ ...commonForm, timeoutSec: "0" }).success).toBe(false);
    expect(commonFieldsSchema.safeParse({ ...commonForm, timeoutSec: "60" }).success).toBe(true);
    expect(commonFieldsSchema.safeParse({ ...commonForm, timeoutSec: "61" }).success).toBe(false);
  });
});
