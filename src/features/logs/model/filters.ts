import { providerTypeSchema } from "@/features/provider/model/provider";
import { RANGES } from "@/shared/lib/ranges";
import { z } from "@/shared/lib/zod";

export const filterSchema = z.object({
  q: z.string().trim().min(1).max(100).optional().catch(undefined),
  provider: providerTypeSchema.optional().catch(undefined),
  status: z.enum(["ok", "fail"]).optional().catch(undefined),
  range: z.enum(RANGES).optional().catch(undefined),
});

export type LogFilters = z.output<typeof filterSchema>;
