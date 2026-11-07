import { describe, expect, it } from "vitest";

import { PROVIDER_REGISTRY } from "../model/provider";
import { getSchemaDefaults } from "./get-schema-defaults";

describe("getSchemaDefaults", () => {
  it("applies defaults when every extra field is optional", () => {
    expect(getSchemaDefaults(PROVIDER_REGISTRY.searxng.schema.add)).toEqual({
      enabled: true,
      timeoutSec: 5,
      cooldown: 60,
      fallbackOnEmpty: true,
      extra: { language: "", categories: "", timeRange: "", safesearch: "" },
    });
  });

  it("skips required extra fields instead of throwing", () => {
    expect(getSchemaDefaults(PROVIDER_REGISTRY.brightdata.schema.add)).toEqual({
      enabled: true,
      timeoutSec: 30,
      cooldown: 60,
      fallbackOnEmpty: true,
      extra: {},
      baseUrl: "https://api.brightdata.com",
    });
  });
});
