"use client";

import { useEffect, useState } from "react";

import type { LogFilters } from "@/features/logs/model/filters";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { Card, CardContent } from "@/shared/components/ui/card";

import { LogFilterBar } from "./log-filters";

function useDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    setIsDesktop(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isDesktop;
}

interface Props {
  filters: LogFilters;
  isFiltered: boolean;
}

export function LogFilterCard({ filters, isFiltered }: Props) {
  const isDesktop = useDesktop();
  const [open, setOpen] = useState(isFiltered);
  const value = isDesktop || open ? ["filters"] : [];

  return (
    <Card>
      <CardContent>
        <Accordion
          value={value}
          onValueChange={(next) => setOpen(Array.isArray(next) && next.includes("filters"))}
        >
          <AccordionItem value="filters" className="border-b-0">
            <AccordionTrigger className="sm:hidden">Filters</AccordionTrigger>
            <AccordionContent>
              <LogFilterBar filters={filters} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
