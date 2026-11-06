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

export function BraveExtraFields({ formId, extra }: ProviderFormExtraFieldsProps<"brave">) {
  const f = extra.getFieldset();
  const safesearchControl = useInputControl<string>({
    name: f.safesearch.name,
    formId,
    initialValue: f.safesearch.defaultValue,
  });
  const freshnessControl = useInputControl<string>({
    name: f.freshness.name,
    formId,
    initialValue: f.freshness.defaultValue,
  });
  const extraSnippetsControl = useInputControl<string>({
    name: f.extraSnippets.name,
    formId,
    initialValue: f.extraSnippets.defaultValue,
  });
  return (
    <>
      <Field data-invalid={!f.country.valid || undefined}>
        <FieldLabel htmlFor={f.country.id}>Country (ISO code)</FieldLabel>
        <Input {...getInputProps(f.country, { type: "text" })} placeholder="JP" maxLength={2} />
        <FieldError>{f.country.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.searchLang.valid || undefined}>
        <FieldLabel htmlFor={f.searchLang.id}>Search language</FieldLabel>
        <Input {...getInputProps(f.searchLang, { type: "text" })} placeholder="jp" />
        <FieldError>{f.searchLang.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.uiLang.valid || undefined}>
        <FieldLabel htmlFor={f.uiLang.id}>UI language</FieldLabel>
        <Input {...getInputProps(f.uiLang, { type: "text" })} placeholder="ja-JP" />
        <FieldError>{f.uiLang.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.safesearch.valid || undefined}>
        <FieldLabel htmlFor={f.safesearch.id}>Safe search</FieldLabel>
        <Select
          value={safesearchControl.value ?? "moderate"}
          onValueChange={(v) => safesearchControl.change(v ?? "moderate")}
        >
          <SelectTrigger id={f.safesearch.id} aria-invalid={!f.safesearch.valid || undefined}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="off">off</SelectItem>
            <SelectItem value="moderate">moderate</SelectItem>
            <SelectItem value="strict">strict</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.safesearch.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.freshness.valid || undefined}>
        <FieldLabel htmlFor={f.freshness.id}>Freshness</FieldLabel>
        <Select
          value={freshnessControl.value ?? ""}
          onValueChange={(v) => freshnessControl.change(v ?? "")}
        >
          <SelectTrigger id={f.freshness.id} aria-invalid={!f.freshness.valid || undefined}>
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            <SelectItem value="pd">Past day (pd)</SelectItem>
            <SelectItem value="pw">Past week (pw)</SelectItem>
            <SelectItem value="pm">Past month (pm)</SelectItem>
            <SelectItem value="py">Past year (py)</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.freshness.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.extraSnippets.valid || undefined}>
        <FieldLabel htmlFor={f.extraSnippets.id}>Extra snippets</FieldLabel>
        <Select
          value={extraSnippetsControl.value ?? ""}
          onValueChange={(v) => extraSnippetsControl.change(v ?? "")}
        >
          <SelectTrigger id={f.extraSnippets.id} aria-invalid={!f.extraSnippets.valid || undefined}>
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Default</SelectItem>
            <SelectItem value="true">Enabled</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.extraSnippets.errors?.[0]}</FieldError>
      </Field>
    </>
  );
}
