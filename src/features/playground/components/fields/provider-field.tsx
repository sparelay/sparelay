"use client";

import { useInputControl, type FieldMetadata } from "@conform-to/react";
import { Sparkles } from "lucide-react";

import { ProviderTag } from "@/features/provider/components/provider-tag";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/shared/components/ui/select";

import type { PlaygroundProviderOption } from "../../model/types";

interface Props {
  formId: string;
  field: FieldMetadata;
  providers: PlaygroundProviderOption[];
}

export function ProviderField({ formId, field, providers }: Props) {
  const control = useInputControl<string>({
    name: field.name,
    formId,
    initialValue: field.defaultValue,
  });
  const isAuto = control.value === "*";
  const selected = providers.find((provider) => provider.id === control.value) ?? null;

  const handleChange = (value: string | null) => {
    control.change(value ?? "");
  };

  return (
    <Field className="w-full sm:w-56">
      <FieldLabel htmlFor={field.id}>Provider</FieldLabel>
      <Select value={control.value ?? ""} onValueChange={handleChange}>
        <SelectTrigger id={field.id}>
          {isAuto ? (
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-4 text-teal-700" aria-hidden />
              Auto
            </span>
          ) : selected ? (
            <ProviderTag
              type={selected.type}
              label={selected.name}
              bordered={false}
              badgeClassName="px-0"
            />
          ) : (
            <span className="text-muted-foreground">Select provider</span>
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="*">
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-4 text-teal-700" aria-hidden />
              Auto
            </span>
          </SelectItem>
          {providers.map((provider) => (
            <SelectItem key={provider.id} value={provider.id}>
              <ProviderTag
                type={provider.type}
                label={provider.name}
                bordered={false}
                badgeClassName="px-0"
              />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError>{field.errors?.[0]}</FieldError>
    </Field>
  );
}
