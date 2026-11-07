"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4";
import { AlertCircle, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { useActionState, useState } from "react";

import { loginAction } from "@/features/auth/actions/login";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { FormActionState } from "@/shared/types";

import { loginFormSchema, type LoginFormValues } from "../model/schema";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<FormActionState | null, FormData>(
    loginAction,
    null,
  );
  const [reveal, setReveal] = useState(false);

  const [form, fields] = useForm<LoginFormValues>({
    lastResult: state?.submission,
    constraint: getZodConstraint(loginFormSchema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginFormSchema });
    },
  });

  const error = fields.apiKey.errors?.[0];

  return (
    <div className="flex min-h-dvh w-full items-center justify-center py-6">
      <div className="w-full max-w-sm">
        <Card className="rounded-2xl bg-card ring-0 [--card-spacing:--spacing(6)]">
          <CardHeader className="justify-items-center gap-3 text-center">
            <img src="/assets/images/logo.svg" alt="Sparelay" className="size-20" />
            <CardTitle className="text-2xl font-semibold tracking-tight">Sparelay</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              {...getFormProps(form)}
              action={formAction}
              className="flex flex-col gap-5"
              noValidate
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor={fields.apiKey.id}>API key</Label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...getInputProps(fields.apiKey, { type: reveal ? "text" : "password" })}
                    autoComplete="off"
                    placeholder="sk-…"
                    className="h-10 pr-10 pl-9"
                  />
                  <button
                    type="button"
                    aria-label={reveal ? "Hide API key" : "Show API key"}
                    aria-pressed={reveal}
                    onClick={() => setReveal((r) => !r)}
                    className="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {reveal ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {error && (
                  <p role="alert" className="flex items-center gap-1.5 text-sm text-destructive">
                    <AlertCircle className="size-3.5 shrink-0" />
                    {error}
                  </p>
                )}
              </div>
              <Button type="submit" size="lg" className="h-10 w-full gap-2" disabled={isPending}>
                {isPending && <Loader2 className="size-4 animate-spin" />}
                {isPending ? "Logging in…" : "Login"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Use the{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.7rem]">
                  API_KEY
                </code>{" "}
                value from your environment file.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
