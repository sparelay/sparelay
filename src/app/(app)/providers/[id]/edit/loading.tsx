import { PageSkeleton } from "@/shared/components/page-skeleton";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function EditProviderLoading() {
  return (
    <PageSkeleton titleWidth="w-40" className="gap-6">
      <Card>
        <CardContent className="flex flex-col gap-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
          <Skeleton className="h-8 w-24 self-end" />
        </CardContent>
      </Card>
    </PageSkeleton>
  );
}
