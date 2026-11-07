import type { DefaultValue } from "@conform-to/react";
import type { z } from "zod";

import type { ProviderType } from "../model/provider";
import type { ProviderFormSchema } from "../model/provider-form";

type ShapeHolder = {
  shape?: z.ZodRawShape;
  def?: { innerType?: ShapeHolder };
};

function getExtraShape(schema: z.ZodType): z.ZodRawShape {
  const holder = schema as unknown as ShapeHolder;
  if (holder.shape) return holder.shape;
  const inner = holder.def?.innerType;
  return inner ? getExtraShape(inner as unknown as z.ZodType) : {};
}

/**
 * Builds the initial form values from a provider schema.
 *
 * Required extra fields have no default, so they are omitted instead of failing
 * the parse and letting the form report them as required on submit.
 */
export function getSchemaDefaults<T extends ProviderType>(
  schema: ProviderFormSchema<T, "add">,
): NonNullable<DefaultValue<z.output<ProviderFormSchema<T, "add">>>> {
  const defaults = schema
    .omit({
      name: true,
      apiKey: true,
      type: true,
      baseUrl: true,
      extra: true,
    })
    .parse({});

  const extra = Object.fromEntries(
    Object.entries(getExtraShape(schema.shape.extra)).flatMap(([key, field]) => {
      const parsed = (field as z.ZodType).safeParse(undefined);
      return parsed.success ? [[key, parsed.data]] : [];
    }),
  );

  const baseUrl = schema.shape.baseUrl.safeParse(undefined);
  return {
    ...defaults,
    extra,
    ...(baseUrl.success ? { baseUrl: baseUrl.data } : {}),
  } as NonNullable<DefaultValue<z.output<ProviderFormSchema<T, "add">>>>;
}
