import { describe, expect, it } from "vitest";

import { fmtTime, formatDateTime } from "./format-date-time";

describe("formatDateTime", () => {
  it("formats a UTC timestamp in the requested timezone", () => {
    expect(formatDateTime("2026-10-31 12:19:23", "Asia/Tokyo")).toBe("2026/10/31 21:19:23");
  });

  it("formats UTC as-is", () => {
    expect(formatDateTime("2026-10-31 12:19:23", "UTC")).toContain("12:19:23");
  });

  it("returns the input for an invalid date", () => {
    expect(formatDateTime("not-a-date", "UTC")).toBe("not-a-date");
  });

  it("returns the input for an unknown timezone", () => {
    expect(formatDateTime("2026-10-31 12:19:23", "Foo/Bar")).toBe("2026-10-31 12:19:23");
  });

  it("fmtTime is an alias of formatDateTime", () => {
    expect(fmtTime("2026-10-31 12:19:23", "Asia/Tokyo")).toBe(
      formatDateTime("2026-10-31 12:19:23", "Asia/Tokyo"),
    );
  });
});
