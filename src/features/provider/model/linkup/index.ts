import { z } from "@/shared/lib/zod";

import {
  commonFieldsSchema,
  generateProviderConfigSchema,
  optionalDateStringSchema,
} from "../common";

export const LINKUP_DEFAULT_BASE_URL = "https://api.linkup.so";

export const linkupExtraFieldsSchema = z
  .object({
    depth: z
      .enum(["flash", "fast", "standard", "deep"], { error: "Invalid search depth" })
      .optional()
      .default("fast"),
    includeDomains: z.string().trim().optional().default(""),
    excludeDomains: z.string().trim().optional().default(""),
    fromDate: optionalDateStringSchema,
    toDate: optionalDateStringSchema,
  })
  .strict();

export const linkupFormSchema = commonFieldsSchema.extend({
  type: z.literal("linkup"),
  baseUrl: commonFieldsSchema.shape.baseUrl.default(LINKUP_DEFAULT_BASE_URL),
  extra: linkupExtraFieldsSchema,
});

export const linkupProviderConfigSchema = generateProviderConfigSchema(linkupFormSchema);

export type LinkupProviderConfig = z.output<typeof linkupProviderConfigSchema>;
