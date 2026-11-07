import { describe, expect, it } from "vitest";

import { PROVIDER_REGISTRY } from "../model/provider";
import { getSchemaDefaults } from "./get-schema-defaults";

describe("getSchemaDefaults", () => {
  it("applies defaults when every extra field is optional", () => {
    const defaults = getSchemaDefaults(PROVIDER_REGISTRY.searxng.schema.add);

    expect(defaults.timeoutSec).toBe(5);
    expect(defaults.cooldown).toBe(60);
    expect(defaults.enabled).toBe(true);
    expect(defaults.fallbackOnEmpty).toBe(true);
    expect(defaults.extra).toMatchObject({ language: "", categories: "", safesearch: "" });
    expect(defaults).not.toHaveProperty("baseUrl");
  });

  it("omits required extra fields instead of throwing", () => {
    const defaults = getSchemaDefaults(PROVIDER_REGISTRY.brightdata.schema.add);

    expect(defaults.timeoutSec).toBe(30);
    expect(defaults.baseUrl).toBe("https://api.brightdata.com");
    expect(defaults.extra).toMatchObject({ engine: "google", gl: "", hl: "", safe: "" });
    expect(defaults.extra).not.toHaveProperty("zone");
  });
});
