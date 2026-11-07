import { describe, expect, it } from "vitest";

import { percentile, rangeHours, sinceModifier } from "./ranges";

describe("rangeHours", () => {
  it("maps every range to its hour count", () => {
    expect(rangeHours("1h")).toEqual({ range: "1h", hours: 1 });
    expect(rangeHours("6h")).toEqual({ range: "6h", hours: 6 });
    expect(rangeHours("12h")).toEqual({ range: "12h", hours: 12 });
    expect(rangeHours("1d")).toEqual({ range: "1d", hours: 24 });
    expect(rangeHours("3d")).toEqual({ range: "3d", hours: 72 });
    expect(rangeHours("7d")).toEqual({ range: "7d", hours: 168 });
    expect(rangeHours("14d")).toEqual({ range: "14d", hours: 336 });
    expect(rangeHours("30d")).toEqual({ range: "30d", hours: 720 });
  });
});

describe("sinceModifier", () => {
  it("formats a SQLite datetime modifier", () => {
    expect(sinceModifier(24)).toBe("-24 hours");
  });
});

describe("percentile", () => {
  it("returns 0 for an empty list", () => {
    expect(percentile([], 95)).toBe(0);
  });

  it("returns the nearest rank", () => {
    expect(percentile([1, 2, 3, 4], 50)).toBe(2);
    expect(percentile([1, 2, 3, 4], 95)).toBe(4);
    expect(percentile([1, 2, 3, 4], 0)).toBe(1);
    expect(percentile([1, 2, 3, 4], 100)).toBe(4);
  });
});
