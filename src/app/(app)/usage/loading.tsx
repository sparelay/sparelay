import { PageTitle } from "@/shared/components/page-title";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function UsageLoading() {
  return (
    <div className="flex flex-col gap-4">
      <PageTitle>
        <Skeleton className="h-7 w-20" />
      </PageTitle>
      <Card>
        <CardContent className="flex flex-col gap-3 py-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
