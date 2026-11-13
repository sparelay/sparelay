import { PageSkeleton } from "@/shared/components/page-skeleton";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <PageSkeleton titleWidth="w-32" className="gap-6">
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-full max-w-md self-end" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Card key={i}>
              <CardContent className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="flex flex-col gap-3 py-3">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="h-6" style={{ width: `${90 - i * 6}%` }} />
            ))}
          </CardContent>
        </Card>
      </div>
    </PageSkeleton>
  );
}
