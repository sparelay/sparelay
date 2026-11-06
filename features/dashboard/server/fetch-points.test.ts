import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterAll, describe, expect, it } from "vitest";

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sparelay-points-"));
process.env.DB_PATH = path.join(tmpDir, "test.sqlite");

const { getDb } = await import("@/shared/db/client");
const { searchLogsTable } = await import("@/shared/db/schemas");
const { fetchPoints } = await import("./fetch-points");

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

function sqliteTime(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString().slice(0, 19).replace("T", " ");
}

describe("fetchPoints", () => {
  it("returns points in ascending time order, not id order", () => {
    const db = getDb();
    db.delete(searchLogsTable).run();
    db.insert(searchLogsTable)
      .values([
        {
          id: "zzz-oldest",
          query: "q",
          source: "api",
          durationMs: 30,
          createdAt: sqliteTime(3),
        },
        {
          id: "aaa-newest",
          query: "q",
          source: "api",
          durationMs: 10,
          createdAt: sqliteTime(1),
        },
        {
          id: "mmm-middle",
          query: "q",
          source: "api",
          durationMs: 20,
          createdAt: sqliteTime(2),
        },
      ])
      .run();

    const { points } = fetchPoints(1);

    expect(points.map((p) => p.d)).toEqual([30, 20, 10]);
  });
});
