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
import { APIFY_DEFAULT_ACTOR_ID } from "../../model/apify";
import type { ProviderFormExtraFieldsProps } from "../provider-form.types";

export function ApifyExtraFields({ formId }: ProviderFormExtraFieldsProps<"apify">) {
  const f = useExtraFields<"apify">(formId).getFieldset();
  const mobileResultsControl = useInputControl<string>({
    name: f.mobileResults.name,
    formId,
    initialValue: f.mobileResults.defaultValue,
  });
  return (
    <>
      <p className="text-sm text-muted-foreground sm:col-span-2">
        Apify Actor runs can take 10–25 seconds. Set Timeout to 25s for the Google Search Scraper;
        shorter values will abort the run.
      </p>
      <Field data-invalid={!f.actorId.valid || undefined}>
        <FieldLabel htmlFor={f.actorId.id}>Actor ID</FieldLabel>
        <Input
          {...getInputProps(f.actorId, { type: "text" })}
          placeholder={APIFY_DEFAULT_ACTOR_ID}
        />
        <FieldError>{f.actorId.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.countryCode.valid || undefined}>
        <FieldLabel htmlFor={f.countryCode.id}>Country code (gl)</FieldLabel>
        <Input {...getInputProps(f.countryCode, { type: "text" })} placeholder="JP" maxLength={2} />
        <FieldError>{f.countryCode.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.languageCode.valid || undefined}>
        <FieldLabel htmlFor={f.languageCode.id}>Language code (hl)</FieldLabel>
        <Input {...getInputProps(f.languageCode, { type: "text" })} placeholder="ja" />
        <FieldError>{f.languageCode.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.mobileResults.valid || undefined}>
        <FieldLabel htmlFor={f.mobileResults.id}>Mobile results</FieldLabel>
        <Select
          value={mobileResultsControl.value ?? ""}
          onValueChange={(v) => mobileResultsControl.change(v ?? "")}
        >
          <SelectTrigger id={f.mobileResults.id} aria-invalid={!f.mobileResults.valid || undefined}>
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Default</SelectItem>
            <SelectItem value="true">Enabled</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.mobileResults.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.quickDateRange.valid || undefined}>
        <FieldLabel htmlFor={f.quickDateRange.id}>Quick date range (tbs qdr)</FieldLabel>
        <Input
          {...getInputProps(f.quickDateRange, { type: "text" })}
          placeholder="d10, w4, m6, y1"
        />
        <FieldError>{f.quickDateRange.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.beforeDate.valid || undefined}>
        <FieldLabel htmlFor={f.beforeDate.id}>Published before</FieldLabel>
        <Input {...getInputProps(f.beforeDate, { type: "date" })} />
        <FieldError>{f.beforeDate.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.afterDate.valid || undefined}>
        <FieldLabel htmlFor={f.afterDate.id}>Published after</FieldLabel>
        <Input {...getInputProps(f.afterDate, { type: "date" })} />
        <FieldError>{f.afterDate.errors?.[0]}</FieldError>
      </Field>
    </>
  );
}
