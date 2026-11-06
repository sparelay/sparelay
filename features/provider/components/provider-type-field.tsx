"use client";

import { useId } from "react";

import { Field, FieldLabel } from "@/shared/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/shared/components/ui/select";

import { toProviderType } from "../lib/to-provider-type";
import { PROVIDER_REGISTRY, type ProviderType } from "../model/provider";
import { ProviderTag } from "./provider-tag";

interface Props {
  value: ProviderType;
  onChange: (value: ProviderType) => void;
}

export function ProviderTypeField({ value, onChange }: Props) {
  const id = useId();
  return (
    <Field className="w-full sm:max-w-sm">
      <FieldLabel htmlFor={id}>
        Provider type <span className="text-red-600">*</span>
      </FieldLabel>
      <Select
        value={value}
        onValueChange={(next) => {
          const type = toProviderType(next);
          if (type) onChange(type);
        }}
      >
        <SelectTrigger id={id} className="w-full">
          <ProviderTag type={value} bordered={false} badgeClassName="px-0" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(PROVIDER_REGISTRY).map((key) => {
            const type = toProviderType(key);
            if (!type) return null;
            return (
              <SelectItem key={type} value={type}>
                <ProviderTag type={type} bordered={false} badgeClassName="px-0" />
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </Field>
  );
}
