"use client";

import { getInputProps, type FieldMetadata } from "@conform-to/react";

import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

interface Props {
  field: FieldMetadata;
}

export function NameField({ field }: Props) {
  const required = Boolean(field.required);
  return (
    <Field data-invalid={!field.valid || undefined}>
      <FieldLabel htmlFor={field.id}>
        Name {required && <span className="text-red-600">*</span>}
      </FieldLabel>
      <Input {...getInputProps(field, { type: "text" })} placeholder="e.g. Primary SearXNG" />
      <FieldError>{field.errors?.[0]}</FieldError>
    </Field>
  );
}
