import { z } from "@/shared/lib/zod";

import {
  commonFieldsSchema,
  generateOptionalIntStringSchema,
  generateProviderConfigSchema,
  optionalDateStringSchema,
  optionalTrueStringSchema,
} from "../common";

export const EXA_DEFAULT_BASE_URL = "https://api.exa.ai";

export const exaExtraFieldsSchema = z
  .object({
    type: z
      .enum(["auto", "lite", "deep-lite", "deep"], { error: "Invalid search method" })
      .optional()
      .default("auto"),
    category: z
      .enum(["", "company", "publication", "news", "personal site", "financial report", "people"], {
        error: "Invalid category",
      })
      .optional()
      .default(""),
    includeDomains: z.string().trim().optional().default(""),
    excludeDomains: z.string().trim().optional().default(""),
    startPublishedDate: optionalDateStringSchema,
    endPublishedDate: optionalDateStringSchema,
    moderation: optionalTrueStringSchema,
    maxAgeHours: generateOptionalIntStringSchema(-1, 720, "Must be between -1 and 720"),
  })
  .strict();

export const exaFormSchema = commonFieldsSchema.extend({
  type: z.literal("exa"),
  baseUrl: commonFieldsSchema.shape.baseUrl.default(EXA_DEFAULT_BASE_URL),
  extra: exaExtraFieldsSchema,
});

export const exaProviderConfigSchema = generateProviderConfigSchema(exaFormSchema);

export type ExaProviderConfig = z.output<typeof exaProviderConfigSchema>;
