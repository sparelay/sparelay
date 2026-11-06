import "server-only";
import type { z } from "zod";

import type { ProviderRow } from "@/shared/db/types";

import { isCoolingDown } from "../../lib/cooldown";
import { PROVIDER_REGISTRY, providerTypeSchema, type ProviderOutput } from "../../model/provider";

function parseExtra(raw: unknown): unknown {
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return raw ?? {};
}

function parseRow<S extends z.ZodObject>(schema: S, value: unknown): z.output<S> {
  return schema.parse(value);
}

export function toProviderOutput(row: ProviderRow): ProviderOutput | null {
  const parsedType = providerTypeSchema.safeParse(row.type);
  if (!parsedType.success) {
    console.warn(`[provider] unknown type: ${row.type} (id=${row.id})`);
    return null;
  }
  const type = parsedType.data;
  const schema = PROVIDER_REGISTRY[type].schema.edit;

  const base = {
    id: row.id,
    type,
    name: row.name,
    baseUrl: row.baseUrl,
    apiKey: "",
    enabled: row.enabled,
    timeoutSec: row.timeoutSec,
    cooldown: row.cooldown,
    fallbackOnEmpty: row.fallbackOnEmpty,
  };

  const withCooldown = <T extends object>(
    value: T,
  ): T & { cooldownUntil: string | null; coolingDown: boolean } => ({
    ...value,
    cooldownUntil: row.cooldownUntil,
    coolingDown: isCoolingDown(row.cooldownUntil),
  });

  try {
    return withCooldown(parseRow(schema, { ...base, extra: parseExtra(row.extra) }));
  } catch {
    try {
      return withCooldown(parseRow(schema, { ...base, extra: {} }));
    } catch (error) {
      console.warn(`[provider] failed to map provider id=${row.id}`, error);
      return null;
    }
  }
}
