import { z } from "@/shared/lib/zod";

import {
  commonFieldsSchema,
  generateDefaultedBaseUrlSchema,
  generateOptionalIntStringSchema,
  generateProviderConfigSchema,
  optionalCountryCodeSchema,
  optionalDateStringSchema,
} from "../common";

export const PARALLEL_DEFAULT_BASE_URL = "https://api.parallel.ai";

export const parallelExtraFieldsSchema = z
  .object({
    mode: z
      .enum(["turbo", "fast", "basic", "advanced"], { error: "Invalid search mode" })
      .optional()
      .default("advanced"),
    includeDomains: z.string().trim().optional().default(""),
    excludeDomains: z.string().trim().optional().default(""),
    maxCharsPerResult: generateOptionalIntStringSchema(
      1,
      1_000_000,
      "Must be between 1 and 1000000",
    ),
    maxCharsTotal: generateOptionalIntStringSchema(1, 1_000_000, "Must be between 1 and 1000000"),
    afterDate: optionalDateStringSchema,
    location: optionalCountryCodeSchema,
  })
  .strict();

export const parallelFormSchema = commonFieldsSchema.extend({
  type: z.literal("parallel"),
  baseUrl: generateDefaultedBaseUrlSchema(PARALLEL_DEFAULT_BASE_URL),
  extra: parallelExtraFieldsSchema,
});

export const parallelProviderConfigSchema = generateProviderConfigSchema(parallelFormSchema);

export type ParallelProviderConfig = z.output<typeof parallelProviderConfigSchema>;
