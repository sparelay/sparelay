import { z } from "@/shared/lib/zod";

import {
  commonFieldsSchema,
  generateDefaultedBaseUrlSchema,
  generateProviderConfigSchema,
} from "../common";

export const MWMBL_DEFAULT_BASE_URL = "https://mwmbl.org";

export const mwmblExtraFieldsSchema = z.object({}).strict().optional().default({});

export const mwmblFormSchema = commonFieldsSchema.extend({
  type: z.literal("mwmbl"),
  baseUrl: generateDefaultedBaseUrlSchema(MWMBL_DEFAULT_BASE_URL),
  apiKey: z.string().trim().optional().default(""),
  extra: mwmblExtraFieldsSchema,
});

export const mwmblProviderConfigSchema = generateProviderConfigSchema(mwmblFormSchema);

export type MwmblProviderConfig = z.output<typeof mwmblProviderConfigSchema>;
