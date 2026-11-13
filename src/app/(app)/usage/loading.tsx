import { PageSkeleton } from "@/shared/components/page-skeleton";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function UsageLoading() {
  return (
    <PageSkeleton titleWidth="w-20">
      <Card>
        <CardContent className="flex flex-col gap-3 py-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    </PageSkeleton>
  );
}
