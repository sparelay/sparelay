import { PageTitle } from "@/shared/components/page-title";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function NewProviderLoading() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle>
        <Skeleton className="h-7 w-40" />
      </PageTitle>
      <Card>
        <CardContent className="flex flex-col gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
          <Skeleton className="h-8 w-24 self-end" />
        </CardContent>
      </Card>
    </div>
  );
}
