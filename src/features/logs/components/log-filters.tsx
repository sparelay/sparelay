"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode, type SubmitEvent } from "react";

import { FailBadge } from "@/features/logs/components/fail-badge";
import { OkBadge } from "@/features/logs/components/ok-badge";
import type { LogFilters } from "@/features/logs/model/filters";
import { ProviderTag } from "@/features/provider/components/provider-tag";
import { PROVIDER_REGISTRY, type ProviderType } from "@/features/provider/model/provider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { RANGES } from "@/shared/lib/ranges";

interface Props {
  filters: LogFilters;
}

export function LogFilters({ filters }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(filters.q ?? "");
  const [provider, setProvider] = useState(filters.provider ?? "");
  const [status, setStatus] = useState(filters.status ?? "");
  const [range, setRange] = useState(filters.range ?? "");
  const [isPending, startTransition] = useTransition();
  const isFiltered = Boolean(filters.q || filters.provider || filters.status || filters.range);

  const providerItems: Record<string, ReactNode> = {
    "": "All providers",
    ...Object.fromEntries(
      Object.entries(PROVIDER_REGISTRY).map(([type]) => [
        type,
        <ProviderTag key={type} type={type as ProviderType} />,
      ]),
    ),
  };
  const statusItems: Record<string, ReactNode> = {
    "": "All status",
    ok: <OkBadge />,
    fail: <FailBadge />,
  };
  const rangeItems: Record<string, string> = {
    "": "All time",
    "1h": "Last hour",
    "6h": "Last 6 hours",
    "12h": "Last 12 hours",
    "1d": "Last 24 hours",
    "3d": "Last 3 days",
    "7d": "Last 7 days",
    "14d": "Last 14 days",
    "30d": "Last 30 days",
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (provider) params.set("provider", provider);
    if (status) params.set("status", status);
    if (range) params.set("range", range);
    const search = params.toString();
    startTransition(() => {
      router.push(search ? `/logs?${search}` : "/logs");
    });
  };

  return (
    <Card>
      <CardContent>
        <Accordion defaultValue={isFiltered ? ["filters"] : []}>
          <AccordionItem value="filters" className="border-b-0">
            <AccordionTrigger className="p-0">Filters</AccordionTrigger>
            <AccordionContent className="mt-4">
              <form
                action="/logs"
                method="get"
                onSubmit={handleSubmit}
                className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-end"
              >
                <Field className="col-span-2 sm:w-64">
                  <FieldLabel htmlFor="logs-filter-query">Query</FieldLabel>
                  <Input
                    id="logs-filter-query"
                    name="q"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search query"
                    type="search"
                  />
                </Field>
                <Field className="sm:w-40">
                  <FieldLabel htmlFor="logs-filter-provider">Provider</FieldLabel>
                  <Select
                    items={providerItems}
                    value={provider}
                    onValueChange={(value) => setProvider(value ?? "")}
                  >
                    <SelectTrigger id="logs-filter-provider" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All providers</SelectItem>
                      {Object.entries(PROVIDER_REGISTRY).map(([type]) => (
                        <SelectItem key={type} value={type}>
                          <ProviderTag type={type as ProviderType} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field className="sm:w-32">
                  <FieldLabel htmlFor="logs-filter-status">Status</FieldLabel>
                  <Select
                    items={statusItems}
                    value={status}
                    onValueChange={(value) => setStatus(value ?? "")}
                  >
                    <SelectTrigger id="logs-filter-status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All status</SelectItem>
                      <SelectItem value="ok">
                        <OkBadge />
                      </SelectItem>
                      <SelectItem value="fail">
                        <FailBadge />
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field className="sm:w-40">
                  <FieldLabel htmlFor="logs-filter-range">Period</FieldLabel>
                  <Select
                    items={rangeItems}
                    value={range}
                    onValueChange={(value) => setRange(value ?? "")}
                  >
                    <SelectTrigger id="logs-filter-range" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All time</SelectItem>
                      {RANGES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {rangeItems[r]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <div className="col-span-2 flex items-end justify-end gap-2 sm:contents">
                  <Button type="submit" disabled={isPending}>
                    Filter
                  </Button>
                  {(filters.q || filters.provider || filters.status || filters.range) && (
                    <a href="/logs" className={buttonVariants({ variant: "ghost" })}>
                      Clear
                    </a>
                  )}
                </div>
              </form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
