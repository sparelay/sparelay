"use server";

import { parseWithZod } from "@conform-to/zod/v4";
import { redirect } from "next/navigation";

import { createSession } from "@/shared/auth/session";
import { verifyLoginKey } from "@/shared/auth/verify";
import type { FormActionState } from "@/shared/types";

import { loginFormSchema } from "../model/schema";

export async function loginAction(
  _prevState: FormActionState | null,
  formData: FormData,
): Promise<FormActionState> {
  const submission = parseWithZod(formData, { schema: loginFormSchema });
  if (submission.status !== "success") {
    return {
      status: "error",
      message: "Invalid input",
      submission: submission.reply(),
      data: null,
    };
  }
  if (!verifyLoginKey(submission.value.apiKey)) {
    return {
      status: "error",
      message: "Invalid API key",
      submission: submission.reply({ fieldErrors: { apiKey: ["Invalid API key"] } }),
      data: null,
    };
  }
  await createSession();
  redirect("/");
}
