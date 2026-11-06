import { describe, expect, it } from "vitest";

import { timeoutFormSchema, timezoneFormSchema } from "./schema";

describe("timeoutFormSchema", () => {
  it("coerces numeric strings", () => {
    const parsed = timeoutFormSchema.parse({ overallTimeoutSec: "45" });
    expect(parsed.overallTimeoutSec).toBe(45);
  });

  it("rejects values outside 1..300", () => {
    expect(timeoutFormSchema.safeParse({ overallTimeoutSec: "0" }).success).toBe(false);
    expect(timeoutFormSchema.safeParse({ overallTimeoutSec: "301" }).success).toBe(false);
  });

  it("rejects non-integers", () => {
    expect(timeoutFormSchema.safeParse({ overallTimeoutSec: "1.5" }).success).toBe(false);
  });

  it("rejects an empty value", () => {
    expect(timeoutFormSchema.safeParse({ overallTimeoutSec: "" }).success).toBe(false);
  });
});

describe("timezoneFormSchema", () => {
  it("accepts known timezones", () => {
    expect(timezoneFormSchema.safeParse({ timezone: "UTC" }).success).toBe(true);
    expect(timezoneFormSchema.safeParse({ timezone: "Asia/Tokyo" }).success).toBe(true);
  });

  it("rejects unknown timezones", () => {
    expect(timezoneFormSchema.safeParse({ timezone: "Foo/Bar" }).success).toBe(false);
    expect(timezoneFormSchema.safeParse({ timezone: "" }).success).toBe(false);
  });
});
