"use client";

import { getInputProps, type FieldMetadata } from "@conform-to/react";

import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

interface Props {
  field: FieldMetadata;
  placeholder?: string;
}

export function BaseUrlField({ field, placeholder }: Props) {
  const required = Boolean(field.required);
  return (
    <Field data-invalid={!field.valid || undefined}>
      <FieldLabel htmlFor={field.id}>
        Base URL {required && <span className="text-red-600">*</span>}
      </FieldLabel>
      <Input {...getInputProps(field, { type: "text" })} placeholder={placeholder} />
      <FieldError>{field.errors?.[0]}</FieldError>
    </Field>
  );
}
