"use client";

import { getFormProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4";
import { startTransition, useActionState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import type { FormActionState } from "@/shared/types";

import { search } from "../actions/search";
import { playgroundFormSchema, type PlaygroundFormValues } from "../model/schema";
import type { PlaygroundProviderOption, PlaygroundResult } from "../model/types";
import { CountField } from "./fields/count-field";
import { ProviderField } from "./fields/provider-field";
import { QueryField } from "./fields/query-field";

interface Props {
  providers: PlaygroundProviderOption[];
}

export function Playground({ providers }: Props) {
  const [state, formAction, isPending] = useActionState<
    FormActionState<PlaygroundResult> | null,
    FormData
  >(search, null);

  const [form, fields] = useForm<PlaygroundFormValues>({
    defaultValue: {
      providerId: "",
      query: "",
      count: "10",
    },
    lastResult: state?.submission,
    constraint: getZodConstraint(playgroundFormSchema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: playgroundFormSchema });
    },
    onSubmit(e, { formData }) {
      e.preventDefault();
      startTransition(() => formAction(formData));
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent>
          <form {...getFormProps(form)} action={formAction}>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
              <QueryField field={fields.query} />
              <ProviderField formId={form.id} field={fields.providerId} providers={providers} />
              <CountField field={fields.count} />
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto sm:self-end">
                {isPending ? "Searching…" : "Search"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {providers.length === 0 && (
        <p className="text-sm text-muted-foreground">No providers registered.</p>
      )}
      {state?.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
      {state?.status === "success" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Results: {state.data.results.length} ({state.data.providerName ?? "unknown"} ·{" "}
              {state.data.attempts} attempts · {state.data.durationMs}ms)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
              {JSON.stringify(state.data.results, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
