import { describe, expect, it } from "vitest";

import { TIMEZONES } from "./timezones";

describe("TIMEZONES", () => {
  it("includes UTC", () => {
    expect(TIMEZONES).toContain("UTC");
  });
});
