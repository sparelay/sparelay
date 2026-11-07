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

export function ParallelExtraFields({ formId }: ProviderFormExtraFieldsProps) {
  const f = useExtraFields<"parallel">(formId).getFieldset();
  const modeControl = useInputControl<string>({
    name: f.mode.name,
    formId,
    initialValue: f.mode.defaultValue,
  });
  return (
    <>
      <Field data-invalid={!f.mode.valid || undefined}>
        <FieldLabel htmlFor={f.mode.id}>Search mode (mode)</FieldLabel>
        <Select
          value={modeControl.value ?? "advanced"}
          onValueChange={(v) => modeControl.change(v ?? "advanced")}
        >
          <SelectTrigger id={f.mode.id} aria-invalid={!f.mode.valid || undefined}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="turbo">turbo</SelectItem>
            <SelectItem value="fast">fast</SelectItem>
            <SelectItem value="basic">basic</SelectItem>
            <SelectItem value="advanced">advanced</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.mode.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.includeDomains.valid || undefined}>
        <FieldLabel htmlFor={f.includeDomains.id}>Include domains (comma separated)</FieldLabel>
        <Input
          {...getInputProps(f.includeDomains, { type: "text" })}
          placeholder="wikipedia.org, docs.python.org/3"
        />
        <FieldError>{f.includeDomains.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.excludeDomains.valid || undefined}>
        <FieldLabel htmlFor={f.excludeDomains.id}>Exclude domains (comma separated)</FieldLabel>
        <Input {...getInputProps(f.excludeDomains, { type: "text" })} placeholder="reddit.com" />
        <FieldError>{f.excludeDomains.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.maxCharsPerResult.valid || undefined}>
        <FieldLabel htmlFor={f.maxCharsPerResult.id}>Max characters per result</FieldLabel>
        <Input
          {...getInputProps(f.maxCharsPerResult, { type: "number" })}
          min={1}
          max={1_000_000}
          placeholder="e.g. 1000"
        />
        <FieldError>{f.maxCharsPerResult.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.maxCharsTotal.valid || undefined}>
        <FieldLabel htmlFor={f.maxCharsTotal.id}>Max characters total</FieldLabel>
        <Input
          {...getInputProps(f.maxCharsTotal, { type: "number" })}
          min={1}
          max={1_000_000}
          placeholder="e.g. 10000"
        />
        <FieldError>{f.maxCharsTotal.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.afterDate.valid || undefined}>
        <FieldLabel htmlFor={f.afterDate.id}>Published after</FieldLabel>
        <Input {...getInputProps(f.afterDate, { type: "date" })} />
        <FieldError>{f.afterDate.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.location.valid || undefined}>
        <FieldLabel htmlFor={f.location.id}>Location (ISO country code)</FieldLabel>
        <Input {...getInputProps(f.location, { type: "text" })} placeholder="JP" maxLength={2} />
        <FieldError>{f.location.errors?.[0]}</FieldError>
      </Field>
    </>
  );
}
