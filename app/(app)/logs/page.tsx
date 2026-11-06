import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LogPagination } from "@/features/logs/components/log-pagination";
import { LogTable } from "@/features/logs/components/log-table";
import { findAllLogs } from "@/features/logs/server/find-all-logs";
import { fetchTimezone } from "@/features/settings/server/fetch-timezone";
import { PageTitle } from "@/shared/components/page-title";
import { Card, CardContent } from "@/shared/components/ui/card";

export const metadata: Metadata = {
  title: "Logs | Sparelay",
};

const PAGE_SIZE = 50;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function LogsPage({ searchParams }: Props) {
  const params = await searchParams;
  const parsed = Number(params.page);
  const page = Number.isInteger(parsed) ? parsed : 1;

  const data = findAllLogs(PAGE_SIZE, page);
  if (data.page.current !== page) {
    redirect(`/logs?page=${data.page.current}`);
  }

  const rangeStart = (data.page.current - 1) * data.page.size + 1;
  const rangeEnd = Math.min(data.page.current * data.page.size, data.totalCount);
  const tz = fetchTimezone();

  return (
    <div className="flex flex-col gap-4">
      <PageTitle>Logs</PageTitle>
      <Card>
        <CardContent className="overflow-x-auto">
          <LogTable rows={data.rows} tz={tz} />
          <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-sm text-muted-foreground sm:text-left">
              {data.totalCount === 0
                ? "0 entries"
                : `${rangeStart}–${rangeEnd} of ${data.totalCount}`}
            </p>
            <LogPagination page={data.page.current} totalPages={data.page.total} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
