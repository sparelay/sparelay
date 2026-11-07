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

import { useExtraFields } from "../../hooks/use-extra-fields";
import type { ProviderFormExtraFieldsProps } from "../provider-form.types";

export function YoucomExtraFields({ formId }: ProviderFormExtraFieldsProps<"youcom">) {
  const f = useExtraFields<"youcom">(formId).getFieldset();
  const freshnessControl = useInputControl<string>({
    name: f.freshness.name,
    formId,
    initialValue: f.freshness.defaultValue,
  });
  const safesearchControl = useInputControl<string>({
    name: f.safesearch.name,
    formId,
    initialValue: f.safesearch.defaultValue,
  });
  const strictOperatorsControl = useInputControl<string>({
    name: f.strictOperators.name,
    formId,
    initialValue: f.strictOperators.defaultValue,
  });
  return (
    <>
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
            <SelectItem value="day">day</SelectItem>
            <SelectItem value="week">week</SelectItem>
            <SelectItem value="month">month</SelectItem>
            <SelectItem value="year">year</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.freshness.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.country.valid || undefined}>
        <FieldLabel htmlFor={f.country.id}>Country (ISO code)</FieldLabel>
        <Input {...getInputProps(f.country, { type: "text" })} placeholder="JP" maxLength={2} />
        <FieldError>{f.country.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.language.valid || undefined}>
        <FieldLabel htmlFor={f.language.id}>Language (BCP 47)</FieldLabel>
        <Input {...getInputProps(f.language, { type: "text" })} placeholder="JA" />
        <FieldError>{f.language.errors?.[0]}</FieldError>
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
      <Field data-invalid={!f.includeDomains.valid || undefined}>
        <FieldLabel htmlFor={f.includeDomains.id}>Include domains (comma separated)</FieldLabel>
        <Input
          {...getInputProps(f.includeDomains, { type: "text" })}
          placeholder="timesofindia.indiatimes.com, ndtv.com"
        />
        <FieldError>{f.includeDomains.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.excludeDomains.valid || undefined}>
        <FieldLabel htmlFor={f.excludeDomains.id}>Exclude domains (comma separated)</FieldLabel>
        <Input {...getInputProps(f.excludeDomains, { type: "text" })} placeholder="reddit.com" />
        <FieldError>{f.excludeDomains.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.strictOperators.valid || undefined}>
        <FieldLabel htmlFor={f.strictOperators.id}>Strict operators</FieldLabel>
        <Select
          value={strictOperatorsControl.value ?? ""}
          onValueChange={(v) => strictOperatorsControl.change(v ?? "")}
        >
          <SelectTrigger
            id={f.strictOperators.id}
            aria-invalid={!f.strictOperators.valid || undefined}
          >
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Default</SelectItem>
            <SelectItem value="true">Enabled</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.strictOperators.errors?.[0]}</FieldError>
      </Field>
    </>
  );
}
