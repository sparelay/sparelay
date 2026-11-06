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
