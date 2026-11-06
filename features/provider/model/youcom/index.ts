import { z } from "@/shared/lib/zod";

import {
  commonFieldsSchema,
  generateDefaultedBaseUrlSchema,
  generateProviderConfigSchema,
  optionalCountryCodeSchema,
  optionalTrueStringSchema,
} from "../common";

export const YOUCOM_DEFAULT_BASE_URL = "https://ydc-index.io";

export const youcomExtraFieldsSchema = z
  .object({
    freshness: z
      .enum(["", "day", "week", "month", "year"], { error: "Invalid freshness" })
      .optional()
      .default(""),
    country: optionalCountryCodeSchema,
    language: z.string().trim().optional().default(""),
    safesearch: z
      .enum(["off", "moderate", "strict"], { error: "Invalid safe search value" })
      .optional()
      .default("moderate"),
    includeDomains: z.string().trim().optional().default(""),
    excludeDomains: z.string().trim().optional().default(""),
    strictOperators: optionalTrueStringSchema,
  })
  .strict();

export const youcomFormSchema = commonFieldsSchema.extend({
  type: z.literal("youcom"),
  baseUrl: generateDefaultedBaseUrlSchema(YOUCOM_DEFAULT_BASE_URL),
  extra: youcomExtraFieldsSchema,
});

export const youcomProviderConfigSchema = generateProviderConfigSchema(youcomFormSchema);

export type YoucomProviderConfig = z.output<typeof youcomProviderConfigSchema>;
