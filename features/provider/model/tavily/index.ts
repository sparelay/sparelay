import { z } from "@/shared/lib/zod";

import {
  commonFieldsSchema,
  generateDefaultedBaseUrlSchema,
  generateProviderConfigSchema,
  optionalDateStringSchema,
  optionalTrueStringSchema,
} from "../common";

export const TAVILY_DEFAULT_BASE_URL = "https://api.tavily.com";

export const tavilyExtraFieldsSchema = z
  .object({
    searchDepth: z
      .enum(["basic", "advanced", "fast", "ultra-fast"], { error: "Invalid search depth" })
      .optional()
      .default("basic"),
    topic: z
      .enum(["general", "news", "finance"], { error: "Invalid topic" })
      .optional()
      .default("general"),
    timeRange: z
      .enum(["", "day", "week", "month", "year", "d", "w", "m", "y"], {
        error: "Invalid time range",
      })
      .optional()
      .default(""),
    includeDomains: z.string().trim().optional().default(""),
    excludeDomains: z.string().trim().optional().default(""),
    includeDomainsMode: z
      .enum(["restrict", "prefer"], { error: "Invalid include domains mode" })
      .optional()
      .default("restrict"),
    startDate: optionalDateStringSchema,
    endDate: optionalDateStringSchema,
    language: z.string().trim().optional().default(""),
    filterByLanguage: optionalTrueStringSchema,
    safeSearch: optionalTrueStringSchema,
  })
  .strict();

export const tavilyFormSchema = z.object({
  ...commonFieldsSchema.shape,
  type: z.literal("tavily"),
  baseUrl: generateDefaultedBaseUrlSchema(TAVILY_DEFAULT_BASE_URL),
  extra: tavilyExtraFieldsSchema,
});

export const tavilyProviderConfigSchema = generateProviderConfigSchema(tavilyFormSchema);

export type TavilyProviderConfig = z.output<typeof tavilyProviderConfigSchema>;
