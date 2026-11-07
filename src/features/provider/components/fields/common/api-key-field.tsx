"use client";

import { getInputProps, type FieldMetadata } from "@conform-to/react";

import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

interface Props {
  field: FieldMetadata;
  mode: "add" | "edit";
}

export function ApiKeyField({ field, mode }: Props) {
  const required = Boolean(field.required);
  return (
    <Field data-invalid={!field.valid || undefined}>
      <FieldLabel htmlFor={field.id}>
        API key {required && <span className="text-red-600">*</span>}
        {mode === "edit" && <span className="text-muted-foreground"> (only when changing)</span>}
      </FieldLabel>
      <Input {...getInputProps(field, { type: "password" })} autoComplete="off" />
      <FieldError>{field.errors?.[0]}</FieldError>
    </Field>
  );
}
