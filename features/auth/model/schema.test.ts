import { describe, expect, it } from "vitest";

import { loginFormSchema } from "./schema";

describe("loginFormSchema", () => {
  it("trims the API key", () => {
    const parsed = loginFormSchema.parse({ apiKey: "  secret  " });
    expect(parsed.apiKey).toBe("secret");
  });

  it("rejects a blank API key", () => {
    expect(loginFormSchema.safeParse({ apiKey: "   " }).success).toBe(false);
    expect(loginFormSchema.safeParse({}).success).toBe(false);
  });
});
