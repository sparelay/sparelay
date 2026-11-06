"use client";

import { getFormProps, useForm, useInputControl } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { editTimezone } from "@/features/settings/actions/edit-timezone";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { FormActionState } from "@/shared/types";

import { timezoneFormSchema, type TimezoneFormValues } from "../model/schema";
import { TIMEZONES } from "../model/timezones";

interface Props {
  initialValue: string;
}

export function TimezoneForm({ initialValue }: Props) {
  const [baseline, setBaseline] = useState(initialValue);
  const [state, formAction, isPending] = useActionState<FormActionState<string> | null, FormData>(
    editTimezone,
    null,
  );

  const [form, fields] = useForm<TimezoneFormValues>({
    defaultValue: {
      timezone: initialValue,
    },
    lastResult: state?.submission,
    constraint: getZodConstraint(timezoneFormSchema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: timezoneFormSchema });
    },
    onSubmit(event, { formData }) {
      event.preventDefault();
      startTransition(() => formAction(formData));
    },
  });

  const timezoneControl = useInputControl<string>({
    name: fields.timezone.name,
    formId: form.id,
    initialValue: fields.timezone.defaultValue,
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

  const error = fields.timezone.errors?.[0];

  return (
    <Card>
      <CardContent>
        <form {...getFormProps(form)} className="grid grid-cols-[1fr_auto] items-center gap-4">
          <span className="text-sm font-medium">Timezone</span>
          <Select
            value={timezoneControl.value ?? ""}
            onValueChange={(value) => timezoneControl.change(value ?? "")}
          >
            <SelectTrigger
              className="w-64"
              aria-invalid={!fields.timezone.valid || undefined}
              aria-describedby={error ? fields.timezone.errorId : undefined}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="col-span-2 text-sm text-destructive">{error}</p>}
          <span />
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending || fields.timezone.value === baseline}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
