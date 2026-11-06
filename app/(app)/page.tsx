import type { Metadata } from "next";

import { Dashboard } from "@/features/dashboard/components/dashboard";
import { fetchTimezone } from "@/features/settings/server/fetch-timezone";
import { PageTitle } from "@/shared/components/page-title";

export const metadata: Metadata = {
  title: "Dashboard | Sparelay",
};

export default async function DashboardPage() {
  const tz = fetchTimezone();

  return (
    <div className="flex flex-col gap-6">
      <PageTitle>Dashboard</PageTitle>
      <Dashboard tz={tz} />
    </div>
  );
}
