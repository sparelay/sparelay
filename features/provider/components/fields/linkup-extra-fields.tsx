"use client";

import { getInputProps, useInputControl } from "@conform-to/react";

import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import type { ProviderFormExtraFieldsProps } from "../provider-form.types";
import { useExtraFields } from "./use-extra-fields";

export function LinkupExtraFields({ formId }: ProviderFormExtraFieldsProps) {
  const f = useExtraFields<"linkup">(formId).getFieldset();
  const depthControl = useInputControl<string>({
    name: f.depth.name,
    formId,
    initialValue: f.depth.defaultValue,
  });
  return (
    <>
      <Field data-invalid={!f.depth.valid || undefined}>
        <FieldLabel htmlFor={f.depth.id}>Search depth (depth)</FieldLabel>
        <Select
          value={depthControl.value ?? "fast"}
          onValueChange={(v) => depthControl.change(v ?? "fast")}
        >
          <SelectTrigger id={f.depth.id} aria-invalid={!f.depth.valid || undefined}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flash">flash</SelectItem>
            <SelectItem value="fast">fast</SelectItem>
            <SelectItem value="standard">standard</SelectItem>
            <SelectItem value="deep">deep</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.depth.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.includeDomains.valid || undefined}>
        <FieldLabel htmlFor={f.includeDomains.id}>Include domains (comma separated)</FieldLabel>
        <Input
          {...getInputProps(f.includeDomains, { type: "text" })}
          placeholder="microsoft.com, docs.python.org"
        />
        <FieldError>{f.includeDomains.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.excludeDomains.valid || undefined}>
        <FieldLabel htmlFor={f.excludeDomains.id}>Exclude domains (comma separated)</FieldLabel>
        <Input {...getInputProps(f.excludeDomains, { type: "text" })} placeholder="reddit.com" />
        <FieldError>{f.excludeDomains.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.fromDate.valid || undefined}>
        <FieldLabel htmlFor={f.fromDate.id}>Published from</FieldLabel>
        <Input {...getInputProps(f.fromDate, { type: "date" })} />
        <FieldError>{f.fromDate.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.toDate.valid || undefined}>
        <FieldLabel htmlFor={f.toDate.id}>Published until</FieldLabel>
        <Input {...getInputProps(f.toDate, { type: "date" })} />
        <FieldError>{f.toDate.errors?.[0]}</FieldError>
      </Field>
    </>
  );
}
