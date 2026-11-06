"use client";

import { getInputProps, type FieldMetadata } from "@conform-to/react";

import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

interface Props {
  field: FieldMetadata;
}

export function CountField({ field }: Props) {
  return (
    <Field className="w-full sm:w-24">
      <FieldLabel htmlFor={field.id}>Count</FieldLabel>
      <Input {...getInputProps(field, { type: "number" })} min={1} max={50} />
      <FieldError>{field.errors?.[0]}</FieldError>
    </Field>
  );
}
