export function sqliteUtcToMs(value: string): number {
  return Date.parse(value.replace(" ", "T") + "Z");
}

export function isCoolingDown(cooldownUntil: string | null | undefined, now = Date.now()): boolean {
  if (!cooldownUntil) return false;
  const ms = sqliteUtcToMs(cooldownUntil);
  return Number.isFinite(ms) && ms > now;
}
