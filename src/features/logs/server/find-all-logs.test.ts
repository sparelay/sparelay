import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterAll, describe, expect, it } from "vitest";

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sparelay-logs-"));
process.env.DB_PATH = path.join(tmpDir, "test.sqlite");

const { getDb } = await import("@/shared/db/client");
const { searchLogsTable } = await import("@/shared/db/schemas");
const { findAllLogs } = await import("./find-all-logs");

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

const base = {
  query: "q",
  providerName: null,
  providerType: null,
  attempts: 1,
  resultsCount: 0,
  durationMs: 1,
  success: true,
  source: "api",
  resultsJson: [],
};

function seedFilters(): void {
  const db = getDb();
  db.delete(searchLogsTable).run();
  db.insert(searchLogsTable)
    .values([
      {
        ...base,
        id: "e1",
        query: "alpha search",
        providerName: "Exa",
        providerType: "exa",
        success: true,
        createdAt: "2026-01-04 00:00:00",
      },
      {
        ...base,
        id: "e2",
        query: "beta search",
        providerName: "Exa",
        providerType: "exa",
        success: false,
        createdAt: "2026-01-03 00:00:00",
      },
      {
        ...base,
        id: "p1",
        query: "alpha other",
        providerName: "Parallel",
        providerType: "parallel",
        success: true,
        createdAt: "2026-01-02 00:00:00",
      },
      {
        ...base,
        id: "w1",
        query: "100% match _test_",
        providerName: null,
        providerType: null,
        success: true,
        createdAt: "2026-01-01 00:00:00",
      },
    ])
    .run();
}

function seed(): void {
  const db = getDb();
  db.delete(searchLogsTable).run();
  db.insert(searchLogsTable)
    .values([
      { ...base, id: "zzz-oldest", createdAt: "2026-01-01 00:00:00" },
      { ...base, id: "aaa-newest", createdAt: "2026-01-03 00:00:00" },
      { ...base, id: "mmm-middle", createdAt: "2026-01-02 00:00:00" },
    ])
    .run();
}

describe("findAllLogs", () => {
  it("orders rows by createdAt descending, not by id", () => {
    seed();

    const { rows } = findAllLogs(10, 1);

    expect(rows.map((r) => r.id)).toEqual(["aaa-newest", "mmm-middle", "zzz-oldest"]);
  });

  it("paginates in the same chronological order", () => {
    seed();

    const { rows, page } = findAllLogs(2, 2);

    expect(rows.map((r) => r.id)).toEqual(["zzz-oldest"]);
    expect(page).toEqual({ current: 2, total: 2, size: 2 });
  });
});

describe("findAllLogs filters", () => {
  it("filters by query substring case-insensitively", () => {
    seedFilters();

    const { rows, totalCount } = findAllLogs(10, 1, {
      q: "ALPHA",
      provider: undefined,
      status: undefined,
    });

    expect(rows.map((r) => r.id)).toEqual(["e1", "p1"]);
    expect(totalCount).toBe(2);
  });

  it("treats LIKE wildcards in the query literally", () => {
    seedFilters();

    const { rows } = findAllLogs(10, 1, {
      q: "100% match",
      provider: undefined,
      status: undefined,
    });

    expect(rows.map((r) => r.id)).toEqual(["w1"]);
  });

  it("filters by provider type", () => {
    seedFilters();

    const { rows } = findAllLogs(10, 1, { provider: "exa" });

    expect(rows.map((r) => r.id)).toEqual(["e1", "e2"]);
  });

  it("filters by success status", () => {
    seedFilters();

    const ok = findAllLogs(10, 1, { status: "ok" });
    const fail = findAllLogs(10, 1, { status: "fail" });

    expect(ok.rows.map((r) => r.id)).toEqual(["e1", "p1", "w1"]);
    expect(fail.rows.map((r) => r.id)).toEqual(["e2"]);
  });

  it("combines filters and reports filtered pagination", () => {
    seedFilters();

    const { rows, totalCount, page } = findAllLogs(1, 1, {
      q: "alpha",
      provider: "exa",
      status: "ok",
    });

    expect(rows.map((r) => r.id)).toEqual(["e1"]);
    expect(totalCount).toBe(1);
    expect(page).toEqual({ current: 1, total: 1, size: 1 });
  });

  it("clamps the page into the filtered range", () => {
    seedFilters();

    const { page } = findAllLogs(1, 99, { q: "alpha" });

    expect(page.current).toBe(2);
  });
});
