import { describe, expect, it } from "vitest";

import { timeBuckets } from "./charts";

const NOW = Date.UTC(2026, 10, 13, 12, 0, 0);
const TZ = "UTC";

function point(
  minutesAgo: number,
  overrides: Partial<{ d: number; success: boolean; provider: string | null }> = {},
) {
  const d = new Date(NOW - minutesAgo * 60_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    t: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`,
    d: overrides.d ?? 100,
    success: overrides.success ?? true,
    provider: overrides.provider === undefined ? "Exa" : overrides.provider,
  };
}

describe("timeBuckets", () => {
  it("splits points into the expected bucket count with labels", () => {
    const buckets = timeBuckets([point(0), point(5), point(10)], TZ, "1h", NOW);

    expect(buckets).toHaveLength(60);
    const total = buckets.reduce((n, b) => n + b.points.length, 0);
    expect(total).toBe(3);
    expect(buckets.at(-1)?.label).toMatch(/^11\/13, 12:0[01]/);
  });

  it("keeps empty buckets and ignores points outside the range", () => {
    const buckets = timeBuckets([point(0), point(120)], TZ, "1h", NOW);

    expect(buckets).toHaveLength(60);
    const total = buckets.reduce((n, b) => n + b.points.length, 0);
    expect(total).toBe(1);
  });
});
