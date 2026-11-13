import { describe, expect, it } from "vitest";

import { parseLogFilters } from "./filters";

describe("parseLogFilters", () => {
  it("parses valid filters", () => {
    expect(parseLogFilters({ q: "  foo  ", provider: "exa", status: "ok" })).toEqual({
      q: "foo",
      provider: "exa",
      status: "ok",
    });
  });

  it("treats unknown provider and status values as undefined", () => {
    expect(parseLogFilters({ provider: "nope", status: "maybe" })).toEqual({
      q: undefined,
      provider: undefined,
      status: undefined,
    });
  });

  it("treats an over-long query as undefined", () => {
    expect(parseLogFilters({ q: "a".repeat(101) }).q).toBeUndefined();
  });

  it("treats a blank query as undefined", () => {
    expect(parseLogFilters({ q: "   " }).q).toBeUndefined();
  });
});
