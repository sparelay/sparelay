import { PageSkeleton } from "@/shared/components/page-skeleton";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function PlaygroundLoading() {
  return (
    <PageSkeleton titleWidth="w-36">
      <Card>
        <CardContent className="flex flex-col gap-3 py-3">
          <div className="flex flex-wrap items-end gap-2">
            <Skeleton className="h-14 w-64" />
            <Skeleton className="h-14 w-40" />
            <Skeleton className="h-14 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </PageSkeleton>
  );
}
