import { describe, expect, it } from "vitest";

import { filterSchema } from "./filters";

describe("filterSchema", () => {
  it("parses valid filters", () => {
    expect(filterSchema.parse({ q: "  foo  ", provider: "exa", status: "ok" })).toEqual({
      q: "foo",
      provider: "exa",
      status: "ok",
    });
  });

  it("strips unknown keys", () => {
    expect(filterSchema.parse({ page: "2", q: "foo" })).toEqual({ q: "foo" });
  });

  it("treats unknown provider and status values as undefined", () => {
    expect(filterSchema.parse({ provider: "nope", status: "maybe" })).toEqual({
      q: undefined,
      provider: undefined,
      status: undefined,
    });
  });

  it("treats an over-long query as undefined", () => {
    expect(filterSchema.parse({ q: "a".repeat(101) }).q).toBeUndefined();
  });

  it("treats a blank query as undefined", () => {
    expect(filterSchema.parse({ q: "   " }).q).toBeUndefined();
  });

  it("treats non-string values as undefined", () => {
    expect(filterSchema.parse({ q: ["a", "b"], provider: ["exa"] })).toEqual({
      q: undefined,
      provider: undefined,
      status: undefined,
    });
  });

  it("returns no filters without throwing for missing params", () => {
    expect(filterSchema.parse({})).toEqual({
      q: undefined,
      provider: undefined,
      status: undefined,
    });
  });
});
