import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { verifyLoginKey } from "./verify";

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
