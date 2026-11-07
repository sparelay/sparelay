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

export function ScrapedoExtraFields({ formId }: ProviderFormExtraFieldsProps<"scrapedo">) {
  const f = useExtraFields<"scrapedo">(formId).getFieldset();
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
  const timePeriodControl = useInputControl<string>({
    name: f.timePeriod.name,
    formId,
    initialValue: f.timePeriod.defaultValue,
  });
  const resolveGotoControl = useInputControl<string>({
    name: f.resolveGoto.name,
    formId,
    initialValue: f.resolveGoto.defaultValue,
  });
  return (
    <>
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
          </SelectContent>
        </Select>
        <FieldError>{f.device.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.gl.valid || undefined}>
        <FieldLabel htmlFor={f.gl.id}>Country (gl)</FieldLabel>
        <Input {...getInputProps(f.gl, { type: "text" })} placeholder="jp" maxLength={2} />
        <FieldError>{f.gl.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.hl.valid || undefined}>
        <FieldLabel htmlFor={f.hl.id}>UI language (hl)</FieldLabel>
        <Input {...getInputProps(f.hl, { type: "text" })} placeholder="ja" />
        <FieldError>{f.hl.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.googleDomain.valid || undefined}>
        <FieldLabel htmlFor={f.googleDomain.id}>Google domain</FieldLabel>
        <Input {...getInputProps(f.googleDomain, { type: "text" })} placeholder="google.co.jp" />
        <FieldError>{f.googleDomain.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.location.valid || undefined}>
        <FieldLabel htmlFor={f.location.id}>Location</FieldLabel>
        <Input {...getInputProps(f.location, { type: "text" })} placeholder="Tokyo,Tokyo,Japan" />
        <FieldError>{f.location.errors?.[0]}</FieldError>
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
      <Field data-invalid={!f.timePeriod.valid || undefined}>
        <FieldLabel htmlFor={f.timePeriod.id}>Time period</FieldLabel>
        <Select
          value={timePeriodControl.value ?? ""}
          onValueChange={(v) => timePeriodControl.change(v ?? "")}
        >
          <SelectTrigger id={f.timePeriod.id} aria-invalid={!f.timePeriod.valid || undefined}>
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            <SelectItem value="last_hour">last_hour</SelectItem>
            <SelectItem value="last_day">last_day</SelectItem>
            <SelectItem value="last_week">last_week</SelectItem>
            <SelectItem value="last_month">last_month</SelectItem>
            <SelectItem value="last_year">last_year</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.timePeriod.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.resolveGoto.valid || undefined}>
        <FieldLabel htmlFor={f.resolveGoto.id}>Resolve Google redirects</FieldLabel>
        <Select
          value={resolveGotoControl.value ?? "true"}
          onValueChange={(v) => resolveGotoControl.change(v ?? "true")}
        >
          <SelectTrigger id={f.resolveGoto.id} aria-invalid={!f.resolveGoto.valid || undefined}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Enabled</SelectItem>
            <SelectItem value="">Disabled</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.resolveGoto.errors?.[0]}</FieldError>
      </Field>
      <p className="text-sm text-muted-foreground sm:col-span-2">
        Scrape.do returns up to 10 organic results per request and can take up to a minute. Set
        Timeout to 60s and make sure the overall timeout is also long enough.
      </p>
    </>
  );
}
