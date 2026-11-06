import type { FieldMetadata } from "@conform-to/react";
import type { z } from "zod";

import type { ProviderType } from "../model/provider";
import type { ProviderExtraFieldsSchema } from "../model/provider-form";

export interface ProviderFormExtraFieldsProps<T extends ProviderType> {
  formId: string;
  extra: FieldMetadata<z.output<ProviderExtraFieldsSchema<T>>>;
}
