import type { Metadata } from "next";

import { NewProviderForm } from "@/features/provider/components/new-provider-form";

export const metadata: Metadata = {
  title: "Add provider | Sparelay",
};

export default function AddProviderPage() {
  return <NewProviderForm />;
}
