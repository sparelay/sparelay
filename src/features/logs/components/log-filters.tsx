"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent, type ReactNode } from "react";

import { FailBadge } from "@/features/logs/components/fail-badge";
import { OkBadge } from "@/features/logs/components/ok-badge";
import type { LogFilters } from "@/features/logs/model/filters";
import { ProviderTag } from "@/features/provider/components/provider-tag";
import { PROVIDER_REGISTRY, type ProviderType } from "@/features/provider/model/provider";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface Props {
  filters: LogFilters;
}

export function LogFilterBar({ filters }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(filters.q ?? "");
  const [provider, setProvider] = useState(filters.provider ?? "");
  const [status, setStatus] = useState(filters.status ?? "");
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (provider) params.set("provider", provider);
    if (status) params.set("status", status);
    const search = params.toString();
    startTransition(() => {
      router.push(search ? `/logs?${search}` : "/logs");
    });
  };

  return (
    <form
      action="/logs"
      method="get"
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-2"
    >
      <Input
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search query"
        className="w-full sm:w-64"
        type="search"
      />
      <Select
        items={providerItems}
        value={provider}
        onValueChange={(value) => setProvider(value ?? "")}
      >
        <SelectTrigger className="w-40">
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
      <Select items={statusItems} value={status} onValueChange={(value) => setStatus(value ?? "")}>
        <SelectTrigger className="w-32">
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
      <Button type="submit" disabled={isPending}>
        Filter
      </Button>
      {(filters.q || filters.provider || filters.status) && (
        <Button variant="ghost" render={<a href="/logs">Clear</a>} />
      )}
    </form>
  );
}
