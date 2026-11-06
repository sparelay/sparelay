import { z } from "@/shared/lib/zod";

import { commonFieldsSchema, generateProviderConfigSchema } from "../common";

export const searxngExtraFieldsSchema = z
  .object({
    language: z.string().trim().optional().default(""),
    categories: z.string().trim().optional().default(""),
    timeRange: z
      .enum(["", "day", "week", "month", "year"], { error: "Invalid time range" })
      .optional()
      .default(""),
    safesearch: z
      .enum(["", "0", "1", "2"], { error: "Invalid safe search value" })
      .optional()
      .default(""),
  })
  .strict();

export const searxngFormSchema = commonFieldsSchema.extend({
  type: z.literal("searxng"),
  apiKey: z.string().trim().optional().default(""),
  extra: searxngExtraFieldsSchema,
});

export const searxngProviderConfigSchema = generateProviderConfigSchema(searxngFormSchema);

export type SearxngProviderConfig = z.output<typeof searxngProviderConfigSchema>;
