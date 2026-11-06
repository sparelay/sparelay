"use client";

import { getInputProps, type FieldMetadata } from "@conform-to/react";

import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

interface Props {
  field: FieldMetadata;
}

export function TimeoutField({ field }: Props) {
  return (
    <Field data-invalid={!field.valid || undefined}>
      <FieldLabel htmlFor={field.id}>Timeout (sec)</FieldLabel>
      <Input {...getInputProps(field, { type: "number" })} min={1} max={60} />
      <FieldError>{field.errors?.[0]}</FieldError>
    </Field>
  );
}
