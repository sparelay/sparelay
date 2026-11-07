import { parseWithZod } from "@conform-to/zod/v4";
import type { z } from "zod";

export function parseProviderForm<S extends z.ZodObject>(schema: S, formData: FormData) {
  return parseWithZod(formData, { schema });
}
