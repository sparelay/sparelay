import { z } from "@/shared/lib/zod";

import {
  commonFieldsSchema,
  generateDefaultedBaseUrlSchema,
  generateProviderConfigSchema,
  optionalCountryCodeSchema,
} from "../common";

export const ZENSERP_DEFAULT_BASE_URL = "https://app.zenserp.com";

export const zenserpExtraFieldsSchema = z
  .object({
    engine: z
      .enum(["google", "bing", "yandex"], { error: "Invalid search engine" })
      .optional()
      .default("google"),
    gl: optionalCountryCodeSchema,
    hl: z.string().trim().optional().default(""),
    location: z.string().trim().optional().default(""),
    device: z
      .enum(["desktop", "mobile", "tablet"], { error: "Invalid device" })
      .optional()
      .default("desktop"),
  })
  .strict();

export const zenserpFormSchema = commonFieldsSchema.extend({
  type: z.literal("zenserp"),
  baseUrl: generateDefaultedBaseUrlSchema(ZENSERP_DEFAULT_BASE_URL),
  extra: zenserpExtraFieldsSchema,
});

export const zenserpProviderConfigSchema = generateProviderConfigSchema(zenserpFormSchema);

export type ZenserpProviderConfig = z.output<typeof zenserpProviderConfigSchema>;
