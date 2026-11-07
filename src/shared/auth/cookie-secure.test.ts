import { describe, expect, it } from "vitest";

import { resolveCookieSecure } from "./cookie-secure";

describe("resolveCookieSecure", () => {
  it("enables Secure when the request was forwarded over HTTPS", () => {
    expect(resolveCookieSecure("https", {})).toBe(true);
    expect(resolveCookieSecure("HTTPS", {})).toBe(true);
    expect(resolveCookieSecure("https, http", {})).toBe(true);
  });

  it("disables Secure for plain HTTP or a missing header", () => {
    expect(resolveCookieSecure("http", {})).toBe(false);
    expect(resolveCookieSecure("http, https", {})).toBe(false);
    expect(resolveCookieSecure(null, {})).toBe(false);
    expect(resolveCookieSecure(undefined, {})).toBe(false);
  });

  it("lets SESSION_COOKIE_SECURE override header detection", () => {
    expect(resolveCookieSecure("http", { SESSION_COOKIE_SECURE: "true" })).toBe(true);
    expect(resolveCookieSecure("https", { SESSION_COOKIE_SECURE: "false" })).toBe(false);
    expect(resolveCookieSecure("https", { SESSION_COOKIE_SECURE: " TRUE " })).toBe(true);
  });

  it("ignores an empty override", () => {
    expect(resolveCookieSecure("https", { SESSION_COOKIE_SECURE: "" })).toBe(true);
    expect(resolveCookieSecure("https", { SESSION_COOKIE_SECURE: "  " })).toBe(true);
  });
});
