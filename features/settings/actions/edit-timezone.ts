"use server";

import { parseWithZod } from "@conform-to/zod/v4";

import { requireSessionOrRedirect } from "@/shared/auth/guard";
import type { FormActionState } from "@/shared/types";

import { timezoneFormSchema } from "../model/schema";
import { updateTimezone } from "../server/update-timezone";

export async function editTimezone(
  _prevState: FormActionState<string> | null,
  formData: FormData,
): Promise<FormActionState<string>> {
  await requireSessionOrRedirect();
  const submission = parseWithZod(formData, { schema: timezoneFormSchema });
  if (submission.status !== "success") {
    return {
      status: "error",
      message: "Invalid input",
      submission: submission.reply(),
      data: null,
    };
  }
  const { timezone } = updateTimezone(submission.value.timezone);
  return {
    status: "success",
    message: "",
    submission: submission.reply(),
    data: timezone,
  };
}
