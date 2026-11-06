import { z } from "@/shared/lib/zod";

import { TIMEZONES } from "./timezones";

export const timeoutFormSchema = z.object({
  overallTimeoutSec: z.coerce
    .number({ error: "Enter a number" })
    .int("Must be a whole number")
    .min(1, "Must be between 1 and 300")
    .max(300, "Must be between 1 and 300"),
});

export const timezoneFormSchema = z.object({
  timezone: z.string().refine((v) => TIMEZONES.includes(v), "Invalid timezone"),
});

export type TimeoutFormValues = z.output<typeof timeoutFormSchema>;
export type TimezoneFormValues = z.output<typeof timezoneFormSchema>;
