import { PageTitle } from "@/shared/components/page-title";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function PlaygroundLoading() {
  return (
    <div className="flex flex-col gap-4">
      <PageTitle>
        <Skeleton className="h-7 w-36" />
      </PageTitle>
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
    </div>
  );
}
