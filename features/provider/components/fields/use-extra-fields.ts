import { useField } from "@conform-to/react";
import type { z } from "zod";

import type { ProviderType } from "../../model/provider";
import type { ProviderExtraFieldsSchema } from "../../model/provider-form";

export function useExtraFields<T extends ProviderType>(formId: string) {
  const [extra] = useField<z.output<ProviderExtraFieldsSchema<T>>>("extra", { formId });
  return extra;
}
