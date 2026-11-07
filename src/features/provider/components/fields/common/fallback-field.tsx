"use client";

import { useInputControl, type FieldMetadata } from "@conform-to/react";

import { Field, FieldLabel } from "@/shared/components/ui/field";
import { Switch } from "@/shared/components/ui/switch";

interface Props {
  formId: string;
  field: FieldMetadata;
}

export function FallbackField({ formId, field }: Props) {
  const control = useInputControl<string>({
    name: field.name,
    formId,
    initialValue: field.defaultValue,
  });
  const checked = ["1", "true", "on"].includes(String(control.value ?? field.defaultValue));
  return (
    <Field>
      <FieldLabel>Fallback on empty</FieldLabel>
      <div>
        <Switch checked={checked} onCheckedChange={(v) => control.change(v ? "1" : "0")} />
      </div>
    </Field>
  );
}
