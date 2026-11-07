import { describe, expect, it } from "vitest";

import { isCoolingDown, sqliteUtcToMs } from "./cooldown";

describe("isCoolingDown", () => {
  const now = Date.parse("2026-11-04T00:00:00Z");

  it("is false when no cooldown is set", () => {
    expect(isCoolingDown(null, now)).toBe(false);
    expect(isCoolingDown("", now)).toBe(false);
  });

  it("is true while cooldown_until is in the future", () => {
    expect(isCoolingDown("2026-11-04 00:01:00", now)).toBe(true);
  });

  it("is false once cooldown_until has passed", () => {
    expect(isCoolingDown("2026-11-03 23:59:59", now)).toBe(false);
    expect(isCoolingDown("2026-11-04 00:00:00", now)).toBe(false);
  });

  it("parses SQLite UTC timestamps", () => {
    expect(sqliteUtcToMs("2026-11-04 00:00:00")).toBe(now);
    expect(sqliteUtcToMs("not a date")).toBeNaN();
  });
});
