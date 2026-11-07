import { z } from "@/shared/lib/zod";

export const providerIdSchema = z.string().trim().min(1);

export function generateTimeoutSecSchema(defaultSec = 5) {
  return z.preprocess(
    (v) => (v === "" || v === undefined ? defaultSec : v),
    z.coerce
      .number({ error: "Enter a number" })
      .int("Must be a whole number")
      .min(1, "Must be between 1 and 60")
      .max(60, "Must be between 1 and 60"),
  );
}

const timeoutSecSchema = generateTimeoutSecSchema();

export function generateCooldownSecSchema(defaultSec = 60) {
  return z.preprocess(
    (v) => (v === "" || v === undefined ? defaultSec : v),
    z.coerce
      .number({ error: "Enter a number" })
      .int("Must be a whole number")
      .min(0, "Must be between 0 and 86400")
      .max(86400, "Must be between 0 and 86400"),
  );
}

const cooldownSecSchema = generateCooldownSecSchema();

const booleanSchema = z.preprocess((v) => {
  if (v === "" || v === undefined || v === null) return true;
  if (v === "1" || v === 1 || v === true || v === "true" || v === "on") return true;
  if (v === "0" || v === 0 || v === false || v === "false") return false;
  return v;
}, z.boolean());

export const optionalDateStringSchema = z
  .string()
  .trim()
  .refine((v) => {
    if (v === "") return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
    const date = new Date(`${v}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === v;
  }, "Use a valid YYYY-MM-DD date")
  .optional()
  .default("");

export const optionalTrueStringSchema = z.enum(["", "true"]).optional().default("");

export const optionalCountryCodeSchema = z
  .string()
  .trim()
  .refine((v) => v === "" || /^[A-Za-z]{2}$/.test(v), "Use a 2-letter country code")
  .optional()
  .default("");

export const commonFieldsSchema = z.object({
  id: providerIdSchema,
  name: z.string().trim().min(1, "Name is required").max(30, "Name must be 30 characters or less"),
  baseUrl: z.url({ error: "Invalid URL" }).trim(),
  apiKey: z.string().trim().min(1, "API key is required"),
  enabled: booleanSchema,
  timeoutSec: timeoutSecSchema,
  cooldown: cooldownSecSchema,
  fallbackOnEmpty: booleanSchema,
  extra: z.record(z.string(), z.unknown()),
});

export const commonProviderConfigSchema = commonFieldsSchema.omit({
  enabled: true,
  timeoutSec: true,
  cooldown: true,
  fallbackOnEmpty: true,
});

export type CommonProviderConfig = z.output<typeof commonProviderConfigSchema>;

type FormOnlyShape = {
  type: z.ZodType;
  enabled: z.ZodType;
  timeoutSec: z.ZodType;
  cooldown: z.ZodType;
  fallbackOnEmpty: z.ZodType;
};

export function generateOptionalIntStringSchema(min: number, max: number, message: string) {
  return z
    .string()
    .trim()
    .refine((v) => {
      if (v === "") return true;
      if (!/^-?\d+$/.test(v)) return false;
      const n = Number(v);
      return n >= min && n <= max;
    }, message)
    .optional()
    .default("");
}

export function generateProviderConfigSchema<Shape extends z.ZodRawShape>(
  formSchema: z.ZodObject<Shape & FormOnlyShape>,
) {
  return formSchema.omit({
    type: true,
    enabled: true,
    timeoutSec: true,
    cooldown: true,
    fallbackOnEmpty: true,
  });
}
