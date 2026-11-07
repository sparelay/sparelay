import { searchInputSchema } from "@/features/search/model/search";
import { z } from "@/shared/lib/zod";

export const playgroundFormSchema = searchInputSchema.extend({
  providerId: z.string().trim().min(1, "Provider is required"),
});

export type PlaygroundFormValues = z.output<typeof playgroundFormSchema>;
