import { z } from "@/shared/lib/zod";

import {
  commonFieldsSchema,
  generateProviderConfigSchema,
  optionalCountryCodeSchema,
} from "../common";

export const SERPAPI_DEFAULT_BASE_URL = "https://serpapi.com";

export const serpapiExtraFieldsSchema = z
  .object({
    location: z.string().trim().optional().default(""),
    gl: optionalCountryCodeSchema,
    hl: z.string().trim().optional().default(""),
    googleDomain: z.string().trim().optional().default(""),
    device: z
      .enum(["desktop", "tablet", "mobile"], { error: "Invalid device" })
      .optional()
      .default("desktop"),
    safe: z
      .enum(["", "active", "off"], { error: "Invalid safe search value" })
      .optional()
      .default(""),
    tbs: z.string().trim().optional().default(""),
  })
  .strict();

export const serpapiFormSchema = commonFieldsSchema.extend({
  type: z.literal("serpapi"),
  baseUrl: commonFieldsSchema.shape.baseUrl.default(SERPAPI_DEFAULT_BASE_URL),
  extra: serpapiExtraFieldsSchema,
});

export const serpapiProviderConfigSchema = generateProviderConfigSchema(serpapiFormSchema);

export type SerpapiProviderConfig = z.output<typeof serpapiProviderConfigSchema>;
