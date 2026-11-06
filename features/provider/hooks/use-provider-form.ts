"use client";

import { useForm, type DefaultValue } from "@conform-to/react";
import { getZodConstraint } from "@conform-to/zod/v4";
import { useActionState } from "react";
import type { z } from "zod";

import type { FormActionState } from "@/shared/types";

import { addProvider } from "../actions/add-provider";
import { editProvider } from "../actions/edit-provider";
import { parseProviderForm } from "../lib/parse-provider-form";
import { PROVIDER_REGISTRY, type ProviderType } from "../model/provider";
import type { ProviderFormSchema, ProviderFormMode } from "../model/provider-form";

export function useProviderForm<const T extends ProviderType, const M extends ProviderFormMode>(
  type: T,
  mode: M,
  defaultValue?: DefaultValue<z.output<ProviderFormSchema<T, M>>>,
) {
  const schema = PROVIDER_REGISTRY[type].schema[mode];
  const action = mode === "add" ? addProvider : editProvider;
  const [state, formAction, isPending] = useActionState<FormActionState | null, FormData>(
    action,
    null,
  );

  const [form, fields] = useForm<z.output<ProviderFormSchema<T, M>>>({
    defaultValue,
    lastResult: state?.submission,
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseProviderForm(schema, formData);
    },
  });

  return { form, fields, formAction, isPending, state };
}
