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

export function FirecrawlExtraFields({ formId }: ProviderFormExtraFieldsProps<"firecrawl">) {
  const f = useExtraFields<"firecrawl">(formId).getFieldset();
  const safeControl = useInputControl<string>({
    name: f.safe.name,
    formId,
    initialValue: f.safe.defaultValue,
  });
  const categoryControl = useInputControl<string>({
    name: f.category.name,
    formId,
    initialValue: f.category.defaultValue,
  });
  return (
    <>
      <Field data-invalid={!f.tbs.valid || undefined}>
        <FieldLabel htmlFor={f.tbs.id}>Time filter (tbs)</FieldLabel>
        <Input {...getInputProps(f.tbs, { type: "text" })} placeholder="qdr:w" />
        <FieldError>{f.tbs.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.location.valid || undefined}>
        <FieldLabel htmlFor={f.location.id}>Location</FieldLabel>
        <Input {...getInputProps(f.location, { type: "text" })} placeholder="Tokyo,Japan" />
        <FieldError>{f.location.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.country.valid || undefined}>
        <FieldLabel htmlFor={f.country.id}>Country (ISO code)</FieldLabel>
        <Input {...getInputProps(f.country, { type: "text" })} placeholder="JP" maxLength={2} />
        <FieldError>{f.country.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.safe.valid || undefined}>
        <FieldLabel htmlFor={f.safe.id}>Safe search</FieldLabel>
        <Select value={safeControl.value ?? ""} onValueChange={(v) => safeControl.change(v ?? "")}>
          <SelectTrigger id={f.safe.id} aria-invalid={!f.safe.valid || undefined}>
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Default</SelectItem>
            <SelectItem value="true">Enabled</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.safe.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.category.valid || undefined}>
        <FieldLabel htmlFor={f.category.id}>Category</FieldLabel>
        <Select
          value={categoryControl.value ?? ""}
          onValueChange={(v) => categoryControl.change(v ?? "")}
        >
          <SelectTrigger id={f.category.id} aria-invalid={!f.category.valid || undefined}>
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            <SelectItem value="pdf">pdf</SelectItem>
            <SelectItem value="developer">developer</SelectItem>
            <SelectItem value="gov">gov</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.category.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.includeDomains.valid || undefined}>
        <FieldLabel htmlFor={f.includeDomains.id}>Include domains (comma separated)</FieldLabel>
        <Input
          {...getInputProps(f.includeDomains, { type: "text" })}
          placeholder="firecrawl.dev, docs.firecrawl.dev"
        />
        <FieldError>{f.includeDomains.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.excludeDomains.valid || undefined}>
        <FieldLabel htmlFor={f.excludeDomains.id}>Exclude domains (comma separated)</FieldLabel>
        <Input {...getInputProps(f.excludeDomains, { type: "text" })} placeholder="example.com" />
        <FieldError>{f.excludeDomains.errors?.[0]}</FieldError>
      </Field>
    </>
  );
}
