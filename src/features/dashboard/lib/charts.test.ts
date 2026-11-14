import { describe, expect, it } from "vitest";

import {
  latencyHistogram,
  providerBuckets,
  providerSeries,
  timeBuckets,
  trendBuckets,
} from "./charts";

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

  it("keeps empty buckets and drops points outside the range", () => {
    const buckets = timeBuckets([point(0), point(120)], TZ, "1h", NOW);

    expect(buckets).toHaveLength(60);
    const total = buckets.reduce((n, b) => n + b.points.length, 0);
    expect(total).toBe(1);
  });
});

describe("trendBuckets", () => {
  it("aggregates success, fail, average latency, and rate", () => {
    const buckets = timeBuckets(
      [
        point(0, { d: 100, success: true }),
        point(0, { d: 200, success: false }),
        point(0, { d: 300, success: true }),
      ],
      TZ,
      "1h",
      NOW,
    );
    const last = trendBuckets(buckets).at(-1);

    expect(last).toEqual({
      label: expect.any(String),
      success: 2,
      fail: 1,
      avgMs: 200,
      rate: 66.7,
    });
  });

  it("reports null values for empty buckets", () => {
    const trend = trendBuckets(timeBuckets([], TZ, "1h", NOW));

    expect(trend[0]).toEqual({
      label: expect.any(String),
      success: 0,
      fail: 0,
      avgMs: null,
      rate: null,
    });
  });
});

describe("providerSeries and providerBuckets", () => {
  it("keeps the top four providers and groups the rest as Other", () => {
    const points = [
      point(0, { provider: "A" }),
      point(0, { provider: "A" }),
      point(0, { provider: "A" }),
      point(0, { provider: "B" }),
      point(0, { provider: "B" }),
      point(0, { provider: "C" }),
      point(0, { provider: "D" }),
      point(0, { provider: "E" }),
    ];
    const buckets = timeBuckets(points, TZ, "1h", NOW);

    expect(providerSeries(buckets)).toEqual(["A", "B", "C", "D", "Other"]);
    const providers = providerBuckets(buckets).at(-1)?.providers;
    expect(providers).toEqual({ A: 3, B: 2, C: 1, D: 1, Other: 1 });
  });

  it("uses Unknown for points without a provider", () => {
    const buckets = timeBuckets([point(1, { provider: null })], TZ, "1h", NOW);

    expect(providerSeries(buckets)).toEqual(["Unknown"]);
  });
});

describe("latencyHistogram", () => {
  it("assigns points to fixed bins", () => {
    const points = [
      point(1, { d: 100 }),
      point(2, { d: 250 }),
      point(3, { d: 700 }),
      point(4, { d: 2500 }),
    ];
    const bins = latencyHistogram(timeBuckets(points, TZ, "1h", NOW));

    expect(bins.map((b) => b.count)).toEqual([1, 1, 0, 1, 0, 0, 0, 1]);
    expect(bins.at(-1)?.label).toBe("2s+");
  });
});
