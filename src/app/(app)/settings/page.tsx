import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAllSettings } from "@/features/settings/actions/get-all-settings";
import { TimeoutForm } from "@/features/settings/components/timeout-form";
import { TimezoneForm } from "@/features/settings/components/timezone-form";
import { PageTitle } from "@/shared/components/page-title";

export const metadata: Metadata = {
  title: "Settings | Sparelay",
};

export default async function SettingsPage() {
  const settings = await getAllSettings();
  if (!settings.success) redirect("/login");
  return (
    <div className="flex w-full flex-col gap-4">
      <PageTitle>Settings</PageTitle>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TimezoneForm initialValue={settings.data.timezone} />
        <TimeoutForm initialValue={settings.data.overallTimeoutSec} />
      </div>
    </div>
  );
}
