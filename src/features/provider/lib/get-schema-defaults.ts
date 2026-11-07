import type { z } from "zod";

type DefaultsShape = {
  name: z.ZodType;
  apiKey: z.ZodType;
  type: z.ZodType;
  baseUrl: z.ZodType;
  extra: z.ZodType;
} & z.ZodRawShape;

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
