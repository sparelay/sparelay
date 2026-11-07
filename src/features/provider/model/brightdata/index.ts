import { z } from "@/shared/lib/zod";

import {
  commonFieldsSchema,
  generateProviderConfigSchema,
  generateTimeoutSecSchema,
  optionalCountryCodeSchema,
} from "../common";
import { GOOGLE_DOMAINS } from "./google-domains";

export { GOOGLE_DOMAINS };

export const BRIGHTDATA_DEFAULT_BASE_URL = "https://api.brightdata.com";
export const BRIGHTDATA_DEFAULT_DOMAIN = "google.com";

export const brightdataExtraFieldsSchema = z
  .object({
    zone: z.string().trim().min(1, "Zone is required"),
    engine: z
      .enum(["google", "bing"], { error: "Invalid search engine" })
      .optional()
      .default("google"),
    domain: z
      .string()
      .trim()
      .regex(/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i, "Invalid domain")
      .optional()
      .default(BRIGHTDATA_DEFAULT_DOMAIN),
    gl: optionalCountryCodeSchema,
    hl: z.string().trim().optional().default(""),
    safe: z
      .enum(["", "active", "off"], { error: "Invalid safe search value" })
      .optional()
      .default(""),
  })
  .strict();

export const brightdataFormSchema = commonFieldsSchema.extend({
  type: z.literal("brightdata"),
  baseUrl: commonFieldsSchema.shape.baseUrl.default(BRIGHTDATA_DEFAULT_BASE_URL),
  timeoutSec: generateTimeoutSecSchema(30),
  extra: brightdataExtraFieldsSchema,
});

export const brightdataProviderConfigSchema = generateProviderConfigSchema(brightdataFormSchema);

export type BrightdataProviderConfig = z.output<typeof brightdataProviderConfigSchema>;
