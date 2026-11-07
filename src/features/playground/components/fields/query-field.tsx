"use client";

import { getInputProps, type FieldMetadata } from "@conform-to/react";

import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

interface Props {
  field: FieldMetadata;
}

export function QueryField({ field }: Props) {
  return (
    <Field className="w-full sm:min-w-0 sm:flex-1">
      <FieldLabel htmlFor={field.id}>Keyword</FieldLabel>
      <Input {...getInputProps(field, { type: "text" })} placeholder="Search keyword" />
      <FieldError>{field.errors?.[0]}</FieldError>
    </Field>
  );
}
