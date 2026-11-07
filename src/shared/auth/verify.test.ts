import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { checkBearer, verifyLoginKey } from "./verify";

const originalKey = process.env.API_KEY;

beforeEach(() => {
  process.env.API_KEY = "secret-key";
});

afterEach(() => {
  if (originalKey === undefined) {
    delete process.env.API_KEY;
  } else {
    process.env.API_KEY = originalKey;
  }
});

function request(authorization?: string): Request {
  const headers = new Headers();
  if (authorization !== undefined) {
    headers.set("authorization", authorization);
  }
  return new Request("http://localhost/search", { headers });
}

describe("checkBearer", () => {
  it("accepts the configured key", () => {
    expect(checkBearer(request("Bearer secret-key"))).toBe(true);
  });

  it("accepts the scheme case-insensitively and tolerates extra spacing", () => {
    expect(checkBearer(request("bearer secret-key"))).toBe(true);
    expect(checkBearer(request("Bearer   secret-key"))).toBe(true);
  });

  it("rejects a different key", () => {
    expect(checkBearer(request("Bearer wrong"))).toBe(false);
  });

  it("rejects a missing or malformed Authorization header", () => {
    expect(checkBearer(request())).toBe(false);
    expect(checkBearer(request("Bearer"))).toBe(false);
    expect(checkBearer(request("Basic secret-key"))).toBe(false);
  });

  it("rejects everything when no key is configured", () => {
    process.env.API_KEY = "";
    expect(checkBearer(request("Bearer secret-key"))).toBe(false);
  });
});

describe("verifyLoginKey", () => {
  it("accepts the configured key", () => {
    expect(verifyLoginKey("secret-key")).toBe(true);
  });

  it("rejects a different key", () => {
    expect(verifyLoginKey("wrong")).toBe(false);
  });

  it("rejects an empty input", () => {
    expect(verifyLoginKey("")).toBe(false);
  });

  it("rejects everything when no key is configured", () => {
    process.env.API_KEY = "";
    expect(verifyLoginKey("")).toBe(false);
    expect(verifyLoginKey("secret-key")).toBe(false);
  });
});
