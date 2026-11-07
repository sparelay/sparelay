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
import { BRIGHTDATA_DEFAULT_DOMAIN, GOOGLE_DOMAINS } from "../../model/brightdata";
import type { ProviderFormExtraFieldsProps } from "../provider-form.types";

export function BrightdataExtraFields({ formId }: ProviderFormExtraFieldsProps<"brightdata">) {
  const f = useExtraFields<"brightdata">(formId).getFieldset();
  const engineControl = useInputControl<string>({
    name: f.engine.name,
    formId,
    initialValue: f.engine.defaultValue,
  });
  const domainControl = useInputControl<string>({
    name: f.domain.name,
    formId,
    initialValue: f.domain.defaultValue,
  });
  const safeControl = useInputControl<string>({
    name: f.safe.name,
    formId,
    initialValue: f.safe.defaultValue,
  });
  const engine = engineControl.value ?? "google";
  const domain =
    engine === "bing" ? "bing.com" : (domainControl.value ?? BRIGHTDATA_DEFAULT_DOMAIN);
  const domainOptions = engine === "bing" ? ["bing.com"] : GOOGLE_DOMAINS;
  return (
    <>
      <Field data-invalid={!f.zone.valid || undefined}>
        <FieldLabel htmlFor={f.zone.id}>
          Zone {Boolean(f.zone.required) && <span className="text-red-600">*</span>}
        </FieldLabel>
        <Input {...getInputProps(f.zone, { type: "text" })} placeholder="serp_api1" />
        <FieldError>{f.zone.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.engine.valid || undefined}>
        <FieldLabel htmlFor={f.engine.id}>Search engine</FieldLabel>
        <Select
          value={engine}
          onValueChange={(v) => {
            const next = v ?? "google";
            engineControl.change(next);
            domainControl.change(next === "bing" ? "bing.com" : BRIGHTDATA_DEFAULT_DOMAIN);
          }}
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
      <Field data-invalid={!f.domain.valid || undefined}>
        <FieldLabel htmlFor={f.domain.id}>Domain</FieldLabel>
        <Select
          value={domain}
          onValueChange={(v) => domainControl.change(v ?? BRIGHTDATA_DEFAULT_DOMAIN)}
        >
          <SelectTrigger id={f.domain.id} aria-invalid={!f.domain.valid || undefined}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {domainOptions.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError>{f.domain.errors?.[0]}</FieldError>
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
