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

export function ZenserpExtraFields({ formId }: ProviderFormExtraFieldsProps<"zenserp">) {
  const f = useExtraFields<"zenserp">(formId).getFieldset();
  const engineControl = useInputControl<string>({
    name: f.engine.name,
    formId,
    initialValue: f.engine.defaultValue,
  });
  const deviceControl = useInputControl<string>({
    name: f.device.name,
    formId,
    initialValue: f.device.defaultValue,
  });
  return (
    <>
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
            <SelectItem value="yandex">yandex</SelectItem>
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
      <Field data-invalid={!f.location.valid || undefined}>
        <FieldLabel htmlFor={f.location.id}>Location</FieldLabel>
        <Input {...getInputProps(f.location, { type: "text" })} placeholder="Tokyo, Japan" />
        <FieldError>{f.location.errors?.[0]}</FieldError>
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
            <SelectItem value="mobile">mobile</SelectItem>
            <SelectItem value="tablet">tablet</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.device.errors?.[0]}</FieldError>
      </Field>
    </>
  );
}
