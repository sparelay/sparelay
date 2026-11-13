import { providerTypeSchema } from "@/features/provider/model/provider";
import { z } from "@/shared/lib/zod";

export const filterSchema = z.object({
  q: z.string().trim().min(1).max(100).optional().catch(undefined),
  provider: providerTypeSchema.optional().catch(undefined),
  status: z.enum(["ok", "fail"]).optional().catch(undefined),
  range: z.enum(["1d", "7d", "30d"]).optional().catch(undefined),
});

export type LogFilters = z.output<typeof filterSchema>;
