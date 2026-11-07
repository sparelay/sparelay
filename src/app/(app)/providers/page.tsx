import type { Metadata } from "next";

import { ProviderManager } from "@/features/provider/components/provider-manager";
import { fetchTimezone } from "@/features/settings/server/fetch-timezone";
import { PageTitle } from "@/shared/components/page-title";

export const metadata: Metadata = {
  title: "Providers | Sparelay",
};

export default function ProvidersPage() {
  const tz = fetchTimezone();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <PageTitle>Providers</PageTitle>
      </div>
      <ProviderManager tz={tz} />
    </div>
  );
}
