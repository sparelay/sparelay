import type { Metadata } from "next";

import { Playground } from "@/features/playground/components/playground";
import type { ProviderOutput } from "@/features/provider/model/provider";
import { findAllProviders } from "@/features/provider/server/find-all-providers";
import { toProviderOutput } from "@/features/provider/server/lib/to-provider-output";
import { PageTitle } from "@/shared/components/page-title";

export const metadata: Metadata = {
  title: "Playground | Sparelay",
};

export const dynamic = "force-dynamic";

export default function PlaygroundPage() {
  const providers = findAllProviders()
    .map(toProviderOutput)
    .filter((provider): provider is ProviderOutput => provider !== null)
    .map(({ id, name, type }) => ({ id, name, type }));

  return (
    <div className="flex flex-col gap-4">
      <PageTitle>Playground</PageTitle>
      <Playground providers={providers} />
    </div>
  );
}
