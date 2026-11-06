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

export function ExaExtraFields({ formId, extra }: ProviderFormExtraFieldsProps<"exa">) {
  const f = extra.getFieldset();
  const typeControl = useInputControl<string>({
    name: f.type.name,
    formId,
    initialValue: f.type.defaultValue,
  });
  const categoryControl = useInputControl<string>({
    name: f.category.name,
    formId,
    initialValue: f.category.defaultValue,
  });
  const moderationControl = useInputControl<string>({
    name: f.moderation.name,
    formId,
    initialValue: f.moderation.defaultValue,
  });
  return (
    <>
      <Field data-invalid={!f.type.valid || undefined}>
        <FieldLabel htmlFor={f.type.id}>Search method (type)</FieldLabel>
        <Select
          value={typeControl.value ?? "auto"}
          onValueChange={(v) => typeControl.change(v ?? "auto")}
        >
          <SelectTrigger id={f.type.id}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">auto</SelectItem>
            <SelectItem value="lite">lite</SelectItem>
            <SelectItem value="deep-lite">deep-lite</SelectItem>
            <SelectItem value="deep">deep</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.type.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.category.valid || undefined}>
        <FieldLabel htmlFor={f.category.id}>Category</FieldLabel>
        <Select
          value={categoryControl.value ?? ""}
          onValueChange={(v) => categoryControl.change(v ?? "")}
        >
          <SelectTrigger id={f.category.id}>
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            <SelectItem value="company">company</SelectItem>
            <SelectItem value="publication">publication</SelectItem>
            <SelectItem value="news">news</SelectItem>
            <SelectItem value="personal site">personal site</SelectItem>
            <SelectItem value="financial report">financial report</SelectItem>
            <SelectItem value="people">people</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.category.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.startPublishedDate.valid || undefined}>
        <FieldLabel htmlFor={f.startPublishedDate.id}>Published after</FieldLabel>
        <Input {...getInputProps(f.startPublishedDate, { type: "date" })} />
        <FieldError>{f.startPublishedDate.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.endPublishedDate.valid || undefined}>
        <FieldLabel htmlFor={f.endPublishedDate.id}>Published before</FieldLabel>
        <Input {...getInputProps(f.endPublishedDate, { type: "date" })} />
        <FieldError>{f.endPublishedDate.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.includeDomains.valid || undefined}>
        <FieldLabel htmlFor={f.includeDomains.id}>Include domains (comma separated)</FieldLabel>
        <Input
          {...getInputProps(f.includeDomains, { type: "text" })}
          placeholder="arxiv.org, paperswithcode.com"
        />
        <FieldError>{f.includeDomains.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.excludeDomains.valid || undefined}>
        <FieldLabel htmlFor={f.excludeDomains.id}>Exclude domains (comma separated)</FieldLabel>
        <Input {...getInputProps(f.excludeDomains, { type: "text" })} placeholder="example.com" />
        <FieldError>{f.excludeDomains.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.moderation.valid || undefined}>
        <FieldLabel htmlFor={f.moderation.id}>Content moderation</FieldLabel>
        <Select
          value={moderationControl.value ?? ""}
          onValueChange={(v) => moderationControl.change(v ?? "")}
        >
          <SelectTrigger id={f.moderation.id} aria-invalid={!f.moderation.valid || undefined}>
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Default</SelectItem>
            <SelectItem value="true">Enabled</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.moderation.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.maxAgeHours.valid || undefined}>
        <FieldLabel htmlFor={f.maxAgeHours.id}>Max cache age (hours)</FieldLabel>
        <Input
          {...getInputProps(f.maxAgeHours, { type: "number" })}
          min={-1}
          max={720}
          placeholder="e.g. 24"
        />
        <FieldError>{f.maxAgeHours.errors?.[0]}</FieldError>
      </Field>
    </>
  );
}
