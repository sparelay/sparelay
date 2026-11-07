"use client";

import { FormProvider, getFormProps, getInputProps } from "@conform-to/react";
import { useEffect, type ComponentType } from "react";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/shared/components/ui/button";

import { useProviderForm } from "../hooks/use-provider-form";
import { PROVIDER_REGISTRY, type ProviderOutput, type ProviderType } from "../model/provider";
import {
  ApiKeyField,
  ApifyExtraFields,
  BaseUrlField,
  BraveExtraFields,
  BrightdataExtraFields,
  CooldownField,
  ExaExtraFields,
  FirecrawlExtraFields,
  FallbackField,
  LinkupExtraFields,
  MwmblExtraFields,
  NameField,
  ParallelExtraFields,
  ScrapedoExtraFields,
  SearxngExtraFields,
  SerpapiExtraFields,
  TavilyExtraFields,
  TimeoutField,
  YoucomExtraFields,
  ZenserpExtraFields,
} from "./fields";
import type { ProviderFormExtraFieldsProps } from "./provider-form.types";

const EXTRA_FIELDS = {
  searxng: SearxngExtraFields,
  exa: ExaExtraFields,
  tavily: TavilyExtraFields,
  parallel: ParallelExtraFields,
  linkup: LinkupExtraFields,
  youcom: YoucomExtraFields,
  mwmbl: MwmblExtraFields,
  brave: BraveExtraFields,
  apify: ApifyExtraFields,
  serpapi: SerpapiExtraFields,
  zenserp: ZenserpExtraFields,
  firecrawl: FirecrawlExtraFields,
  scrapedo: ScrapedoExtraFields,
  brightdata: BrightdataExtraFields,
} satisfies { [K in ProviderType]: ComponentType<ProviderFormExtraFieldsProps<K>> };

type DefaultsShape = {
  name: z.ZodType;
  apiKey: z.ZodType;
  type: z.ZodType;
  baseUrl: z.ZodType;
  extra: z.ZodType;
} & z.ZodRawShape;

function getSchemaDefaults<T extends z.ZodObject<DefaultsShape>>(schema: T) {
  const defaults = schema
    .omit({
      name: true,
      apiKey: true,
      type: true,
      baseUrl: true,
    })
    .parse({ extra: {} });
  const baseUrl = schema.shape.baseUrl.safeParse(undefined);
  return baseUrl.success ? { ...defaults, baseUrl: baseUrl.data } : defaults;
}

type Props =
  | {
      mode: "add";
      type: ProviderType;
      provider?: never;
      onSaved: () => void;
      onCancel?: () => void;
    }
  | {
      mode: "edit";
      type?: never;
      provider: ProviderOutput;
      onSaved: () => void;
      onCancel?: () => void;
    };

export function ProviderForm({ mode, type, provider, onSaved, onCancel }: Props) {
  const activeType = mode === "add" ? type : provider.type;
  const defaultValue =
    mode === "edit" ? provider : getSchemaDefaults(PROVIDER_REGISTRY[activeType].schema.add);

  const { form, fields, formAction, isPending, state } = useProviderForm(
    activeType,
    mode,
    defaultValue,
  );

  useEffect(() => {
    if (state?.status === "success") {
      toast.success(state.message);
      onSaved();
    }
  }, [state, onSaved]);

  const ExtraFields = EXTRA_FIELDS[activeType];

  return (
    <FormProvider context={form.context}>
      <form {...getFormProps(form)} action={formAction} className="flex flex-col gap-6">
        {form.errors && <p className="text-sm text-destructive">{form.errors.join(", ")}</p>}

        {mode === "edit" && <input type="hidden" name="id" value={provider.id} />}
        <input type="hidden" name={fields.type.name} value={activeType} />
        <input {...getInputProps(fields.enabled, { type: "hidden" })} />

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Basic</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <NameField field={fields.name} />
            <BaseUrlField field={fields.baseUrl} />
            <ApiKeyField field={fields.apiKey} mode={mode} />
            <TimeoutField field={fields.timeoutSec} />
            <CooldownField field={fields.cooldown} />
            <FallbackField formId={form.id} field={fields.fallbackOnEmpty} />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Advanced</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <ExtraFields formId={form.id} />
          </div>
        </section>

        <div className="sticky bottom-0 z-10 mt-6 flex flex-col-reverse gap-2 border-t bg-background/95 py-3 backdrop-blur sm:flex-row sm:justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : mode === "edit" ? "Save" : "Add"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
