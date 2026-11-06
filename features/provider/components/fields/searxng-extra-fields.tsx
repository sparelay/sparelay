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

export function SearxngExtraFields({ formId, extra }: ProviderFormExtraFieldsProps<"searxng">) {
  const f = extra.getFieldset();
  const timeRangeControl = useInputControl<string>({
    name: f.timeRange.name,
    formId,
    initialValue: f.timeRange.defaultValue,
  });
  const safesearchControl = useInputControl<string>({
    name: f.safesearch.name,
    formId,
    initialValue: f.safesearch.defaultValue,
  });
  return (
    <>
      <Field data-invalid={!f.language.valid || undefined}>
        <FieldLabel htmlFor={f.language.id}>Language (language)</FieldLabel>
        <Input {...getInputProps(f.language, { type: "text" })} placeholder="ja-JP" />
        <FieldError>{f.language.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.categories.valid || undefined}>
        <FieldLabel htmlFor={f.categories.id}>Categories (categories)</FieldLabel>
        <Input {...getInputProps(f.categories, { type: "text" })} placeholder="general" />
        <FieldError>{f.categories.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.timeRange.valid || undefined}>
        <FieldLabel htmlFor={f.timeRange.id}>Time range (time_range)</FieldLabel>
        <Select
          value={timeRangeControl.value ?? ""}
          onValueChange={(v) => timeRangeControl.change(v ?? "")}
        >
          <SelectTrigger id={f.timeRange.id} aria-invalid={!f.timeRange.valid || undefined}>
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            <SelectItem value="day">day</SelectItem>
            <SelectItem value="week">week</SelectItem>
            <SelectItem value="month">month</SelectItem>
            <SelectItem value="year">year</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.timeRange.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.safesearch.valid || undefined}>
        <FieldLabel htmlFor={f.safesearch.id}>Safe search (safesearch)</FieldLabel>
        <Select
          value={safesearchControl.value ?? ""}
          onValueChange={(v) => safesearchControl.change(v ?? "")}
        >
          <SelectTrigger id={f.safesearch.id} aria-invalid={!f.safesearch.valid || undefined}>
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Default</SelectItem>
            <SelectItem value="0">0 (None)</SelectItem>
            <SelectItem value="1">1 (Moderate)</SelectItem>
            <SelectItem value="2">2 (Strict)</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.safesearch.errors?.[0]}</FieldError>
      </Field>
    </>
  );
}
