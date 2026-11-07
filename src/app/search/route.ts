import { NextResponse } from "next/server";

import { createLog } from "@/features/logs/server/create-log";
import { searchInputSchema } from "@/features/search/model/search";
import { search } from "@/features/search/server/search";
import { requireApiKey } from "@/shared/auth/guard";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const unauthorized = requireApiKey(req);
  if (unauthorized) return unauthorized;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const parsed = searchInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "invalid input" },
      { status: 400 },
    );
  }
  const { query, count } = parsed.data;

  const started = Date.now();
  const outcome = await search(query, count);
  createLog({
    query,
    providerName: outcome.provider?.name ?? null,
    providerType: outcome.provider?.type ?? null,
    attempts: outcome.attempts,
    resultsCount: outcome.results.length,
    durationMs: Date.now() - started,
    success: outcome.status.type === "success",
    source: "api",
    resultsJson: outcome.results,
  });

  return NextResponse.json(outcome.results);
}
