import { providerTypeSchema, type ProviderType } from "../model/provider";

export function toProviderType(v: unknown): ProviderType | null {
  const result = providerTypeSchema.safeParse(v);
  return result.success ? result.data : null;
}
