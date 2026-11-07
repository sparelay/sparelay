import { describe, expect, it } from "vitest";

import { searchInputSchema } from "./search";

describe("searchInputSchema", () => {
  it("trims the query", () => {
    const parsed = searchInputSchema.parse({ query: "  hello  " });
    expect(parsed.query).toBe("hello");
  });

  it("defaults count to 10", () => {
    const parsed = searchInputSchema.parse({ query: "hello" });
    expect(parsed.count).toBe(10);
  });

  it("coerces string counts", () => {
    const parsed = searchInputSchema.parse({ query: "hello", count: "5" });
    expect(parsed.count).toBe(5);
  });

  it("rejects a blank query", () => {
    expect(searchInputSchema.safeParse({ query: "   " }).success).toBe(false);
    expect(searchInputSchema.safeParse({}).success).toBe(false);
  });

  it("rejects counts outside 1..50", () => {
    expect(searchInputSchema.safeParse({ query: "x", count: 0 }).success).toBe(false);
    expect(searchInputSchema.safeParse({ query: "x", count: 51 }).success).toBe(false);
  });

  it("rejects non-integer counts", () => {
    expect(searchInputSchema.safeParse({ query: "x", count: 1.5 }).success).toBe(false);
  });
});
