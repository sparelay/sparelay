import { cn } from "cn";

import { PageTitle } from "@/shared/components/page-title";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface Props {
  children?: React.ReactNode;
  titleWidth?: string;
  className?: string;
}

export function PageSkeleton({ children, titleWidth = "w-28", className }: Props) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <PageTitle>
        <Skeleton className={`h-7 ${titleWidth}`} />
      </PageTitle>
      {children ?? (
        <Card>
          <CardContent className="flex flex-col gap-3 py-3">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="h-6" style={{ width: `${90 - i * 8}%` }} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
