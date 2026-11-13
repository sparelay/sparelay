import { providerTypeSchema } from "@/features/provider/model/provider";
import { z } from "@/shared/lib/zod";

export type LogStatusFilter = "ok" | "fail";

export interface LogFilters {
  q?: string;
  provider?: string;
  status?: LogStatusFilter;
}

const querySchema = z.string().trim().min(1).max(100);
const statusSchema = z.enum(["ok", "fail"]);

export function parseLogFilters(params: {
  q?: string;
  provider?: string;
  status?: string;
}): LogFilters {
  const q = querySchema.safeParse(params.q);
  const provider = providerTypeSchema.safeParse(params.provider);
  const status = statusSchema.safeParse(params.status);
  return {
    q: q.success ? q.data : undefined,
    provider: provider.success ? provider.data : undefined,
    status: status.success ? status.data : undefined,
  };
}
