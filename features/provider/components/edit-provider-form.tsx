"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { PageTitle } from "@/shared/components/page-title";
import { buttonVariants } from "@/shared/components/ui/button";
import { Field, FieldLabel } from "@/shared/components/ui/field";

import type { ProviderOutput } from "../model/provider";
import { ProviderForm } from "./provider-form";
import { ProviderTag } from "./provider-tag";

interface Props {
  provider: ProviderOutput;
}

export function EditProviderForm({ provider }: Props) {
  const router = useRouter();
  const handleDone = useCallback(() => router.push("/providers"), [router]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageTitle>Edit provider</PageTitle>
        <Link href="/providers" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Back to providers
        </Link>
      </div>
      <Field className="w-full sm:max-w-sm">
        <FieldLabel>Provider type</FieldLabel>
        <div>
          <ProviderTag type={provider.type} />
        </div>
      </Field>
      <ProviderForm mode="edit" provider={provider} onSaved={handleDone} onCancel={handleDone} />
    </div>
  );
}
