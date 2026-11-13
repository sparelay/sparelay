import { PageTitle } from "@/shared/components/page-title";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function ProvidersLoading() {
  return (
    <div className="flex flex-col gap-4">
      <PageTitle>
        <Skeleton className="h-7 w-28" />
      </PageTitle>
      <Card>
        <CardContent className="flex flex-col gap-3 py-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="h-6 flex-1" />
              <Skeleton className="h-8 w-44" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
