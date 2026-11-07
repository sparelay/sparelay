import type { PROVIDER_REGISTRY, ProviderType } from "./provider";

export type ProviderFormMode = keyof (typeof PROVIDER_REGISTRY)[ProviderType]["schema"];

export type ProviderFormSchema<
  T extends ProviderType,
  M extends ProviderFormMode,
> = (typeof PROVIDER_REGISTRY)[T]["schema"][M];

export type ProviderExtraFieldsSchema<T extends ProviderType> = ProviderFormSchema<
  T,
  ProviderFormMode
>["shape"]["extra"];
