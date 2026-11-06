"use client";

import { getInputProps, type FieldMetadata } from "@conform-to/react";

import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

interface Props {
  field: FieldMetadata;
}

export function CooldownField({ field }: Props) {
  return (
    <Field data-invalid={!field.valid || undefined}>
      <FieldLabel htmlFor={field.id}>Cooldown on 429 error (sec)</FieldLabel>
      <Input {...getInputProps(field, { type: "number" })} min={0} max={86400} />
      <p className="text-xs text-muted-foreground">0 disables the cooldown.</p>
      <FieldError>{field.errors?.[0]}</FieldError>
    </Field>
  );
}
