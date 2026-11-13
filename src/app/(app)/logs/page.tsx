import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LogFilterBar } from "@/features/logs/components/log-filters";
import { LogPagination } from "@/features/logs/components/log-pagination";
import { LogTable } from "@/features/logs/components/log-table";
import { parseLogFilters } from "@/features/logs/model/filters";
import { findAllLogs } from "@/features/logs/server/find-all-logs";
import { fetchTimezone } from "@/features/settings/server/fetch-timezone";
import { PageTitle } from "@/shared/components/page-title";
import { Card, CardContent } from "@/shared/components/ui/card";

export const metadata: Metadata = {
  title: "Logs | Sparelay",
};

const PAGE_SIZE = 50;

type Props = {
  searchParams: Promise<{ page?: string; q?: string; provider?: string; status?: string }>;
};

export default async function LogsPage({ searchParams }: Props) {
  const params = await searchParams;
  const parsed = Number(params.page);
  const page = Number.isInteger(parsed) ? parsed : 1;
  const filters = parseLogFilters(params);

  const data = findAllLogs(PAGE_SIZE, page, filters);
  if (data.page.current !== page) {
    const redirectParams = new URLSearchParams();
    if (filters.q) redirectParams.set("q", filters.q);
    if (filters.provider) redirectParams.set("provider", filters.provider);
    if (filters.status) redirectParams.set("status", filters.status);
    redirectParams.set("page", String(data.page.current));
    redirect(`/logs?${redirectParams.toString()}`);
  }

  const filterParams = new URLSearchParams();
  if (filters.q) filterParams.set("q", filters.q);
  if (filters.provider) filterParams.set("provider", filters.provider);
  if (filters.status) filterParams.set("status", filters.status);
  const filtered = Boolean(filters.q || filters.provider || filters.status);
  const rangeStart = (data.page.current - 1) * data.page.size + 1;
  const rangeEnd = Math.min(data.page.current * data.page.size, data.totalCount);
  const tz = fetchTimezone();

  return (
    <div className="flex flex-col gap-4">
      <PageTitle>Logs</PageTitle>
      <Card>
        <CardContent className="overflow-x-auto">
          <div className="py-3">
            <LogFilterBar filters={filters} />
          </div>
          {data.totalCount === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {filtered ? "No matching logs" : "No history"}
            </p>
          ) : (
            <>
              <LogTable rows={data.rows} tz={tz} />
              <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-center text-sm text-muted-foreground sm:text-left">
                  {`${rangeStart}–${rangeEnd} of ${data.totalCount}`}
                </p>
                <LogPagination
                  page={data.page.current}
                  totalPages={data.page.total}
                  params={filterParams.toString()}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
