import type { z } from "zod";

type DefaultsShape = {
  name: z.ZodType;
  apiKey: z.ZodType;
  type: z.ZodType;
  baseUrl: z.ZodType;
  extra: z.ZodType;
} & z.ZodRawShape;

/**
 * Builds the initial form values from a provider schema.
 *
 * The extra object is parsed separately: a provider can have required extra
 * fields (for example Bright Data's zone) which should start empty and be
 * reported as required on submit instead of failing the defaults parse.
 */
export function getSchemaDefaults<T extends z.ZodObject<DefaultsShape>>(schema: T) {
  const defaults = schema
    .pick({
      enabled: true,
      timeoutSec: true,
      cooldown: true,
      fallbackOnEmpty: true,
    })
    .parse({});

  const extra = schema.pick({ extra: true }).safeParse({ extra: {} });
  const baseUrl = schema.pick({ baseUrl: true }).safeParse({});

  return {
    ...defaults,
    extra: extra.success ? extra.data.extra : {},
    ...(baseUrl.success ? { baseUrl: baseUrl.data.baseUrl } : {}),
  };
}
