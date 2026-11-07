import { timingSafeEqual } from "node:crypto";

import { configuredKey } from "./config";

function constantTimeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  // A length mismatch returns early, but it only reveals the key length, which
  // is not sensitive. Equal-length inputs are always compared in constant time.
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

export function checkBearer(req: Request): boolean {
  const key = configuredKey();
  if (!key) return false;

  const header = req.headers.get("authorization");
  const match = header?.match(/^Bearer\s+(\S+)$/i);
  if (!match) return false;

  return constantTimeEqual(match[1], key);
}

export function verifyLoginKey(input: string): boolean {
  const key = configuredKey();
  if (!key || !input) return false;
  return constantTimeEqual(input, key);
}
