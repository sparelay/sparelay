import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { requireSession } from "./session";
import { checkBearer } from "./verify";

export async function requireSessionOrRedirect(): Promise<void> {
  if (!(await requireSession())) redirect("/login");
}

export function requireApiKey(req: Request): NextResponse | null {
  if (!checkBearer(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}
