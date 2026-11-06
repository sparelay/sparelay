import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getLog } from "@/features/logs/actions/get-log";
import { LogDetail } from "@/features/logs/components/log-detail";
import { fetchTimezone } from "@/features/settings/server/fetch-timezone";
import { PageTitle } from "@/shared/components/page-title";
import { buttonVariants } from "@/shared/components/ui/button";

type Params = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  return { title: `Log #${id} | Sparelay` };
}

export default async function LogDetailPage({ params }: Params) {
  const { id } = await params;
  const res = await getLog(id);
  if (!res.success) {
    notFound();
  }
  const tz = fetchTimezone();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <PageTitle>Log #{res.data.id}</PageTitle>
        <Link href="/logs" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Back to logs
        </Link>
      </div>
      <LogDetail log={res.data} tz={tz} />
    </div>
  );
}
