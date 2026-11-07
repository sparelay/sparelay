import { z } from "@/shared/lib/zod";

import {
  commonFieldsSchema,
  generateProviderConfigSchema,
  generateTimeoutSecSchema,
  optionalCountryCodeSchema,
  optionalTrueStringSchema,
} from "../common";

export const SCRAPEDO_DEFAULT_BASE_URL = "https://api.scrape.do";

export const scrapedoExtraFieldsSchema = z
  .object({
    device: z
      .enum(["desktop", "mobile"], { error: "Invalid device" })
      .optional()
      .default("desktop"),
    gl: optionalCountryCodeSchema,
    hl: z.string().trim().optional().default(""),
    googleDomain: z.string().trim().optional().default(""),
    location: z.string().trim().optional().default(""),
    safe: optionalTrueStringSchema,
    timePeriod: z
      .enum(["", "last_hour", "last_day", "last_week", "last_month", "last_year"], {
        error: "Invalid time period",
      })
      .optional()
      .default(""),
    resolveGoto: z
      .enum(["", "true"], { error: "Invalid resolveGoto value" })
      .optional()
      .default("true"),
  })
  .strict();

export const scrapedoFormSchema = commonFieldsSchema.extend({
  type: z.literal("scrapedo"),
  baseUrl: commonFieldsSchema.shape.baseUrl.default(SCRAPEDO_DEFAULT_BASE_URL),
  timeoutSec: generateTimeoutSecSchema(60),
  extra: scrapedoExtraFieldsSchema,
});

export const scrapedoProviderConfigSchema = generateProviderConfigSchema(scrapedoFormSchema);

export type ScrapedoProviderConfig = z.output<typeof scrapedoProviderConfigSchema>;
