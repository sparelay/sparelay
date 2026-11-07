"use server";

import { parseWithZod } from "@conform-to/zod/v4";

import { requireSessionOrRedirect } from "@/shared/auth/guard";
import type { FormActionState } from "@/shared/types";

import { timeoutFormSchema } from "../model/schema";
import { updateOverallTimeoutSec } from "../server/update-overall-timeout";

export async function editOverallTimeout(
  _prevState: FormActionState<number> | null,
  formData: FormData,
): Promise<FormActionState<number>> {
  await requireSessionOrRedirect();
  const submission = parseWithZod(formData, { schema: timeoutFormSchema });
  if (submission.status !== "success") {
    return {
      status: "error",
      message: "Invalid input",
      submission: submission.reply(),
      data: null,
    };
  }
  const overallTimeoutSec = updateOverallTimeoutSec(submission.value.overallTimeoutSec);
  return {
    status: "success",
    message: "",
    submission: submission.reply(),
    data: overallTimeoutSec,
  };
}
