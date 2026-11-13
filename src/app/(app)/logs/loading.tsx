import { PageTitle } from "@/shared/components/page-title";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function LogsLoading() {
  return (
    <div className="flex flex-col gap-4">
      <PageTitle>
        <Skeleton className="h-7 w-14" />
      </PageTitle>
      <Card>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 py-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-full" />
            {Array.from({ length: 12 }, (_, i) => (
              <Skeleton key={i} className="h-6" style={{ width: `${94 - i * 4}%` }} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
