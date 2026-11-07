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

export function BrightdataExtraFields({ formId }: ProviderFormExtraFieldsProps<"brightdata">) {
  const f = useExtraFields<"brightdata">(formId).getFieldset();
  const engineControl = useInputControl<string>({
    name: f.engine.name,
    formId,
    initialValue: f.engine.defaultValue,
  });
  const safeControl = useInputControl<string>({
    name: f.safe.name,
    formId,
    initialValue: f.safe.defaultValue,
  });
  return (
    <>
      <Field data-invalid={!f.zone.valid || undefined}>
        <FieldLabel htmlFor={f.zone.id}>Zone</FieldLabel>
        <Input {...getInputProps(f.zone, { type: "text" })} placeholder="serp_api1" />
        <FieldError>{f.zone.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.engine.valid || undefined}>
        <FieldLabel htmlFor={f.engine.id}>Search engine</FieldLabel>
        <Select
          value={engineControl.value ?? "google"}
          onValueChange={(v) => engineControl.change(v ?? "google")}
        >
          <SelectTrigger id={f.engine.id} aria-invalid={!f.engine.valid || undefined}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="google">google</SelectItem>
            <SelectItem value="bing">bing</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.engine.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.gl.valid || undefined}>
        <FieldLabel htmlFor={f.gl.id}>Country (gl)</FieldLabel>
        <Input {...getInputProps(f.gl, { type: "text" })} placeholder="jp" maxLength={2} />
        <FieldError>{f.gl.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.hl.valid || undefined}>
        <FieldLabel htmlFor={f.hl.id}>Language (hl)</FieldLabel>
        <Input {...getInputProps(f.hl, { type: "text" })} placeholder="ja" />
        <FieldError>{f.hl.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.safe.valid || undefined}>
        <FieldLabel htmlFor={f.safe.id}>Safe search</FieldLabel>
        <Select value={safeControl.value ?? ""} onValueChange={(v) => safeControl.change(v ?? "")}>
          <SelectTrigger id={f.safe.id} aria-invalid={!f.safe.valid || undefined}>
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Default</SelectItem>
            <SelectItem value="active">active</SelectItem>
            <SelectItem value="off">off</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.safe.errors?.[0]}</FieldError>
      </Field>
    </>
  );
}
