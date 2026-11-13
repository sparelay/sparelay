"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode, type SubmitEvent } from "react";

import { FailBadge } from "@/features/logs/components/fail-badge";
import { OkBadge } from "@/features/logs/components/ok-badge";
import type { LogFilters } from "@/features/logs/model/filters";
import { ProviderTag } from "@/features/provider/components/provider-tag";
import { PROVIDER_REGISTRY, type ProviderType } from "@/features/provider/model/provider";
import { Button } from "@/shared/components/ui/button";
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

export function LogFilterBar({ filters }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(filters.q ?? "");
  const [provider, setProvider] = useState(filters.provider ?? "");
  const [status, setStatus] = useState(filters.status ?? "");
  const [range, setRange] = useState(filters.range ?? "");
  const [isPending, startTransition] = useTransition();

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
    const isClear = event.submitter?.hasAttribute("data-clear") ?? false;
    startTransition(() => {
      if (isClear) {
        router.push("/logs");
        return;
      }
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (provider) params.set("provider", provider);
      if (status) params.set("status", status);
      if (range) params.set("range", range);
      const search = params.toString();
      router.push(search ? `/logs?${search}` : "/logs");
    });
  };

  return (
    <form
      action="/logs"
      method="get"
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-2"
    >
      <Field className="w-full sm:w-64">
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
      <Field className="w-40">
        <FieldLabel htmlFor="logs-filter-provider">Provider</FieldLabel>
        <Select
          items={providerItems}
          value={provider}
          onValueChange={(value) => setProvider(value ?? "")}
        >
          <SelectTrigger id="logs-filter-provider">
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
      <Field className="w-32">
        <FieldLabel htmlFor="logs-filter-status">Status</FieldLabel>
        <Select
          items={statusItems}
          value={status}
          onValueChange={(value) => setStatus(value ?? "")}
        >
          <SelectTrigger id="logs-filter-status">
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
      <Field className="w-40">
        <FieldLabel htmlFor="logs-filter-range">Period</FieldLabel>
        <Select items={rangeItems} value={range} onValueChange={(value) => setRange(value ?? "")}>
          <SelectTrigger id="logs-filter-range">
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
      <Button type="submit" disabled={isPending}>
        Filter
      </Button>
      {(filters.q || filters.provider || filters.status || filters.range) && (
        <Button type="submit" variant="ghost" data-clear="" disabled={isPending}>
          Clear
        </Button>
      )}
    </form>
  );
}
