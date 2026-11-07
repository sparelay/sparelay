"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { editOverallTimeout } from "@/features/settings/actions/edit-overall-timeout";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import type { FormActionState } from "@/shared/types";

import { timeoutFormSchema, type TimeoutFormValues } from "../model/schema";

interface Props {
  initialValue: number;
}

export function TimeoutForm({ initialValue }: Props) {
  const [baseline, setBaseline] = useState(initialValue);
  const [state, formAction, isPending] = useActionState<FormActionState<number> | null, FormData>(
    editOverallTimeout,
    null,
  );

  const [form, fields] = useForm<TimeoutFormValues>({
    defaultValue: {
      overallTimeoutSec: initialValue,
    },
    lastResult: state?.submission,
    constraint: getZodConstraint(timeoutFormSchema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: timeoutFormSchema });
    },
    onSubmit(event, { formData }) {
      event.preventDefault();
      startTransition(() => formAction(formData));
    },
  });

  useEffect(() => {
    if (!state) return;
    if (state.status === "success") {
      setBaseline(state.data);
      toast.success("Saved");
    } else {
      toast.error(state.message || "Failed to save");
    }
  }, [state]);

  const error = fields.overallTimeoutSec.errors?.[0];

  return (
    <Card>
      <CardContent>
        <form {...getFormProps(form)} className="grid grid-cols-[1fr_auto] items-center gap-4">
          <span className="text-sm font-medium">Overall timeout (sec)</span>
          <Input
            {...getInputProps(fields.overallTimeoutSec, { type: "number" })}
            min={1}
            max={300}
            className="w-64"
          />
          {error && <p className="col-span-2 text-sm text-destructive">{error}</p>}
          <span />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending || Number(fields.overallTimeoutSec.value) === baseline}
            >
              {isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
