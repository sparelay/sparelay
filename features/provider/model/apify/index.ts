import { z } from "@/shared/lib/zod";

import {
  commonFieldsSchema,
  generateDefaultedBaseUrlSchema,
  generateProviderConfigSchema,
  generateTimeoutSecSchema,
  optionalCountryCodeSchema,
  optionalDateStringSchema,
  optionalTrueStringSchema,
} from "../common";

export const APIFY_DEFAULT_BASE_URL = "https://api.apify.com";
export const APIFY_DEFAULT_ACTOR_ID = "apify~google-search-scraper";

export const apifyExtraFieldsSchema = z
  .object({
    actorId: z
      .string()
      .trim()
      .min(1, "Actor ID is required")
      .optional()
      .default(APIFY_DEFAULT_ACTOR_ID),
    countryCode: optionalCountryCodeSchema,
    languageCode: z.string().trim().optional().default(""),
    mobileResults: optionalTrueStringSchema,
    quickDateRange: z.string().trim().optional().default(""),
    beforeDate: optionalDateStringSchema,
    afterDate: optionalDateStringSchema,
  })
  .strict();

export const apifyFormSchema = commonFieldsSchema.extend({
  type: z.literal("apify"),
  baseUrl: generateDefaultedBaseUrlSchema(APIFY_DEFAULT_BASE_URL),
  timeoutSec: generateTimeoutSecSchema(25),
  extra: apifyExtraFieldsSchema,
});

export const apifyProviderConfigSchema = generateProviderConfigSchema(apifyFormSchema);

export type ApifyProviderConfig = z.output<typeof apifyProviderConfigSchema>;
