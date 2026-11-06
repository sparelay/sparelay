"use client";

import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

import { RANGES, type Range } from "../model/types";

interface Props {
  range: Range;
  onChange: (range: Range) => void;
}

export function RangeTabs({ range, onChange }: Props) {
  return (
    <div className="md:flex md:justify-end">
      <Tabs value={range} onValueChange={(v) => onChange(v as Range)} className="w-full md:w-auto">
        <TabsList className="flex w-full scrollbar-none overflow-x-auto md:w-fit [&::-webkit-scrollbar]:hidden">
          {RANGES.map((r) => (
            <TabsTrigger key={r} value={r}>
              {r}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
