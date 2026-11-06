import { z } from "@/shared/lib/zod";

export const loginFormSchema = z.object({
  apiKey: z.string().trim().min(1, "API key is required"),
});

export type LoginFormValues = z.output<typeof loginFormSchema>;
