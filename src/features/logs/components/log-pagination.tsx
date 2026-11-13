import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";

interface Props {
  page: number;
  totalPages: number;
  params?: string;
}

function pageItems(page: number, totalPages: number): (number | "ellipsis")[] {
  const wanted = [1, page - 1, page, page + 1, totalPages];
  const pages = [...new Set(wanted)].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const items: (number | "ellipsis")[] = [];
  let previous = 0;
  for (const p of pages) {
    if (previous !== 0 && p - previous > 1) items.push("ellipsis");
    items.push(p);
    previous = p;
  }
  return items;
}

export function LogPagination({ page, totalPages, params = "" }: Props) {
  const atFirst = page <= 1;
  const atLast = page >= totalPages;
  const href = (p: number) => (params ? `/logs?${params}&page=${p}` : `/logs?page=${p}`);

  return (
    <Pagination className="mx-0 w-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={atFirst ? undefined : href(page - 1)}
            aria-disabled={atFirst}
            className={atFirst ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
        {pageItems(page, totalPages).map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink href={href(item)} isActive={item === page}>
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href={atLast ? undefined : href(page + 1)}
            aria-disabled={atLast}
            className={atLast ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
