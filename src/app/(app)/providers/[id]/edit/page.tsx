import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EditProviderForm } from "@/features/provider/components/edit-provider-form";
import { findProvider } from "@/features/provider/server/find-provider";
import { toProviderOutput } from "@/features/provider/server/lib/to-provider-output";

export const metadata: Metadata = {
  title: "Edit provider | Sparelay",
};

type Params = {
  params: Promise<{ id: string }>;
};

export default async function EditProviderPageRoute({ params }: Params) {
  const { id } = await params;
  const row = findProvider(id);
  if (!row) notFound();
  const provider = toProviderOutput(row);
  if (!provider) notFound();
  return <EditProviderForm provider={provider} />;
}
