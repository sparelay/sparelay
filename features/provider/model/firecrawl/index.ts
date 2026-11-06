import { z } from "@/shared/lib/zod";

import {
  commonFieldsSchema,
  generateDefaultedBaseUrlSchema,
  generateProviderConfigSchema,
  optionalCountryCodeSchema,
  optionalTrueStringSchema,
} from "../common";

export const FIRECRAWL_DEFAULT_BASE_URL = "https://api.firecrawl.dev";

export const firecrawlExtraFieldsSchema = z
  .object({
    tbs: z.string().trim().optional().default(""),
    location: z.string().trim().optional().default(""),
    country: optionalCountryCodeSchema,
    safe: optionalTrueStringSchema,
    category: z
      .enum(["", "pdf", "developer", "gov"], { error: "Invalid category" })
      .optional()
      .default(""),
    includeDomains: z.string().trim().optional().default(""),
    excludeDomains: z.string().trim().optional().default(""),
  })
  .strict();

export const firecrawlFormSchema = commonFieldsSchema.extend({
  type: z.literal("firecrawl"),
  baseUrl: generateDefaultedBaseUrlSchema(FIRECRAWL_DEFAULT_BASE_URL),
  apiKey: z.string().trim().optional().default(""),
  extra: firecrawlExtraFieldsSchema,
});

export const firecrawlProviderConfigSchema = generateProviderConfigSchema(firecrawlFormSchema);

export type FirecrawlProviderConfig = z.output<typeof firecrawlProviderConfigSchema>;
