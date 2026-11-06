import type { SubmissionResult } from "@conform-to/react";

export type ServerActionResult<T> =
  | { success: true; message: string; data: T }
  | { success: false; message: string; data: null };

export type FormActionState<T = null> =
  | {
      status: "success";
      message: string;
      submission: SubmissionResult;
      data: T;
    }
  | {
      status: "error";
      message: string;
      submission: SubmissionResult;
      data: null;
    };
