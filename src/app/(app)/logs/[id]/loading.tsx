import { PageSkeleton } from "@/shared/components/page-skeleton";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function LogDetailLoading() {
  return (
    <PageSkeleton titleWidth="w-64">
      <Card>
        <CardContent className="flex flex-col gap-3 py-3">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 flex-1" />
            </div>
          ))}
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    </PageSkeleton>
  );
}
