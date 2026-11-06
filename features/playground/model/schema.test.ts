import { describe, expect, it } from "vitest";

import { playgroundFormSchema } from "./schema";

describe("playgroundFormSchema", () => {
  it("defaults count to 10", () => {
    const parsed = playgroundFormSchema.parse({ providerId: "p1", query: "hello" });
    expect(parsed.count).toBe(10);
  });

  it("coerces string counts", () => {
    const parsed = playgroundFormSchema.parse({ providerId: "p1", query: "hello", count: "3" });
    expect(parsed.count).toBe(3);
  });

  it("requires a provider and a query", () => {
    expect(playgroundFormSchema.safeParse({ query: "hello" }).success).toBe(false);
    expect(playgroundFormSchema.safeParse({ providerId: "p1", query: "  " }).success).toBe(false);
  });
});
