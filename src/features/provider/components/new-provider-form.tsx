"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { PageTitle } from "@/shared/components/page-title";
import { buttonVariants } from "@/shared/components/ui/button";

import type { ProviderType } from "../model/provider";
import { ProviderForm } from "./provider-form";
import { ProviderTypeField } from "./provider-type-field";

export function NewProviderForm() {
  const router = useRouter();
  const [type, setType] = useState<ProviderType>("searxng");
  const handleDone = useCallback(() => router.push("/providers"), [router]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageTitle>Add provider</PageTitle>
        <Link href="/providers" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Back to providers
        </Link>
      </div>
      <ProviderTypeField value={type} onChange={setType} />
      <ProviderForm key={type} mode="add" type={type} onSaved={handleDone} onCancel={handleDone} />
    </div>
  );
}
