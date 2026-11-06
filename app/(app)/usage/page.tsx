import type { Metadata } from "next";

import { HttpApiUsageCard } from "@/features/usage/components/http-api-usage-card";
import { McpUsageCard } from "@/features/usage/components/mcp-usage-card";
import { OpenWebUIUsageCard } from "@/features/usage/components/open-web-ui-usage-card";
import { PageTitle } from "@/shared/components/page-title";

export const metadata: Metadata = {
  title: "Usage | Sparelay",
};

export default function UsagePage() {
  return (
    <div className="flex flex-col gap-4">
      <PageTitle>Usage</PageTitle>
      <OpenWebUIUsageCard />
      <HttpApiUsageCard />
      <McpUsageCard />
    </div>
  );
}
