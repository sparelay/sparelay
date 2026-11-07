export function resolveCookieSecure(
  forwardedProto: string | null | undefined,
  env: Record<string, string | undefined> = process.env,
): boolean {
  const override = env.SESSION_COOKIE_SECURE?.trim();
  if (override) {
    return override.toLowerCase() === "true";
  }

  const proto = forwardedProto?.split(",")[0]?.trim().toLowerCase();
  return proto === "https";
}
