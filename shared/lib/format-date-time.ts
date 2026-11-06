const TZ_LOCALES: Record<string, string> = {
  UTC: "en-GB",
  "Asia/Tokyo": "ja-JP",
  "Asia/Singapore": "en-SG",
  "Australia/Sydney": "en-AU",
  "Europe/London": "en-GB",
  "Europe/Paris": "en-GB",
  "America/New_York": "en-US",
  "America/Chicago": "en-US",
  "America/Los_Angeles": "en-US",
  "Pacific/Auckland": "en-NZ",
};

export function formatDateTime(utc: string, tz: string): string {
  const d = new Date(utc.replace(" ", "T") + "Z");
  if (Number.isNaN(d.getTime())) return utc;
  try {
    return new Intl.DateTimeFormat(TZ_LOCALES[tz] ?? "en-GB", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(d);
  } catch {
    return utc;
  }
}

export function fmtTime(utc: string, tz: string): string {
  return formatDateTime(utc, tz);
}
