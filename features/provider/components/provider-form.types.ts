import type { ProviderType } from "../model/provider";

export interface ProviderFormExtraFieldsProps<T extends ProviderType> {
  formId: string;
  /** Type-only marker so EXTRA_FIELDS stays keyed by provider. Never passed at runtime. */
  readonly __providerType?: T;
}
