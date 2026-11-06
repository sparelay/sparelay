import { z } from "@/shared/lib/zod";

import {
  commonFieldsSchema,
  generateDefaultedBaseUrlSchema,
  generateProviderConfigSchema,
  optionalCountryCodeSchema,
  optionalTrueStringSchema,
} from "../common";

export const BRAVE_DEFAULT_BASE_URL = "https://api.search.brave.com";

export const braveExtraFieldsSchema = z
  .object({
    country: optionalCountryCodeSchema,
    searchLang: z.string().trim().optional().default(""),
    uiLang: z.string().trim().optional().default(""),
    safesearch: z
      .enum(["off", "moderate", "strict"], { error: "Invalid safe search value" })
      .optional()
      .default("moderate"),
    freshness: z
      .enum(["", "pd", "pw", "pm", "py"], { error: "Invalid freshness" })
      .optional()
      .default(""),
    extraSnippets: optionalTrueStringSchema,
  })
  .strict();

export const braveFormSchema = commonFieldsSchema.extend({
  type: z.literal("brave"),
  baseUrl: generateDefaultedBaseUrlSchema(BRAVE_DEFAULT_BASE_URL),
  extra: braveExtraFieldsSchema,
});

export const braveProviderConfigSchema = generateProviderConfigSchema(braveFormSchema);

export type BraveProviderConfig = z.output<typeof braveProviderConfigSchema>;
