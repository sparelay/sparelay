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

export function SerpapiExtraFields({ formId, extra }: ProviderFormExtraFieldsProps<"serpapi">) {
  const f = extra.getFieldset();
  const deviceControl = useInputControl<string>({
    name: f.device.name,
    formId,
    initialValue: f.device.defaultValue,
  });
  const safeControl = useInputControl<string>({
    name: f.safe.name,
    formId,
    initialValue: f.safe.defaultValue,
  });
  return (
    <>
      <Field data-invalid={!f.location.valid || undefined}>
        <FieldLabel htmlFor={f.location.id}>Location</FieldLabel>
        <Input {...getInputProps(f.location, { type: "text" })} placeholder="Tokyo, Japan" />
        <FieldError>{f.location.errors?.[0]}</FieldError>
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
      <Field data-invalid={!f.googleDomain.valid || undefined}>
        <FieldLabel htmlFor={f.googleDomain.id}>Google domain</FieldLabel>
        <Input {...getInputProps(f.googleDomain, { type: "text" })} placeholder="google.co.jp" />
        <FieldError>{f.googleDomain.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.device.valid || undefined}>
        <FieldLabel htmlFor={f.device.id}>Device</FieldLabel>
        <Select
          value={deviceControl.value ?? "desktop"}
          onValueChange={(v) => deviceControl.change(v ?? "desktop")}
        >
          <SelectTrigger id={f.device.id} aria-invalid={!f.device.valid || undefined}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desktop">desktop</SelectItem>
            <SelectItem value="tablet">tablet</SelectItem>
            <SelectItem value="mobile">mobile</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.device.errors?.[0]}</FieldError>
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
      <Field data-invalid={!f.tbs.valid || undefined}>
        <FieldLabel htmlFor={f.tbs.id}>Advanced filter (tbs)</FieldLabel>
        <Input {...getInputProps(f.tbs, { type: "text" })} placeholder="qdr:w" />
        <FieldError>{f.tbs.errors?.[0]}</FieldError>
      </Field>
    </>
  );
}
