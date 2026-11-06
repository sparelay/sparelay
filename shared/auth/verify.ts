import crypto from "node:crypto";

import { configuredKey } from "./config";

export function checkBearer(req: Request): boolean {
  const key = configuredKey();
  if (!key) return false;
  const h = req.headers.get("authorization") ?? "";
  return h === `Bearer ${key}`;
}

export function verifyLoginKey(input: string): boolean {
  const key = configuredKey();
  if (!key || !input) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(key);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
