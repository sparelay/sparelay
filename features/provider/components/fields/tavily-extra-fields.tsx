"use client";

import { getInputProps, useInputControl } from "@conform-to/react";

import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import type { ProviderFormExtraFieldsProps } from "../provider-form.types";
import { useExtraFields } from "./use-extra-fields";

export function TavilyExtraFields({ formId }: ProviderFormExtraFieldsProps<"tavily">) {
  const f = useExtraFields<"tavily">(formId).getFieldset();
  const searchDepthControl = useInputControl<string>({
    name: f.searchDepth.name,
    formId,
    initialValue: f.searchDepth.defaultValue,
  });
  const topicControl = useInputControl<string>({
    name: f.topic.name,
    formId,
    initialValue: f.topic.defaultValue,
  });
  const timeRangeControl = useInputControl<string>({
    name: f.timeRange.name,
    formId,
    initialValue: f.timeRange.defaultValue,
  });
  const includeDomainsModeControl = useInputControl<string>({
    name: f.includeDomainsMode.name,
    formId,
    initialValue: f.includeDomainsMode.defaultValue,
  });
  const filterByLanguageControl = useInputControl<string>({
    name: f.filterByLanguage.name,
    formId,
    initialValue: f.filterByLanguage.defaultValue,
  });
  const safeSearchControl = useInputControl<string>({
    name: f.safeSearch.name,
    formId,
    initialValue: f.safeSearch.defaultValue,
  });
  return (
    <>
      <Field data-invalid={!f.searchDepth.valid || undefined}>
        <FieldLabel htmlFor={f.searchDepth.id}>Search depth (searchDepth)</FieldLabel>
        <Select
          value={searchDepthControl.value ?? "basic"}
          onValueChange={(v) => searchDepthControl.change(v ?? "basic")}
        >
          <SelectTrigger id={f.searchDepth.id} aria-invalid={!f.searchDepth.valid || undefined}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">basic</SelectItem>
            <SelectItem value="advanced">advanced</SelectItem>
            <SelectItem value="fast">fast</SelectItem>
            <SelectItem value="ultra-fast">ultra-fast</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.searchDepth.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.topic.valid || undefined}>
        <FieldLabel htmlFor={f.topic.id}>Topic</FieldLabel>
        <Select
          value={topicControl.value ?? "general"}
          onValueChange={(v) => topicControl.change(v ?? "general")}
        >
          <SelectTrigger id={f.topic.id} aria-invalid={!f.topic.valid || undefined}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">general</SelectItem>
            <SelectItem value="news">news</SelectItem>
            <SelectItem value="finance">finance</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.topic.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.timeRange.valid || undefined}>
        <FieldLabel htmlFor={f.timeRange.id}>Time range (timeRange)</FieldLabel>
        <Select
          value={timeRangeControl.value ?? ""}
          onValueChange={(v) => timeRangeControl.change(v ?? "")}
        >
          <SelectTrigger id={f.timeRange.id} aria-invalid={!f.timeRange.valid || undefined}>
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            <SelectItem value="day">day</SelectItem>
            <SelectItem value="week">week</SelectItem>
            <SelectItem value="month">month</SelectItem>
            <SelectItem value="year">year</SelectItem>
            <SelectItem value="d">d</SelectItem>
            <SelectItem value="w">w</SelectItem>
            <SelectItem value="m">m</SelectItem>
            <SelectItem value="y">y</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.timeRange.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.startDate.valid || undefined}>
        <FieldLabel htmlFor={f.startDate.id}>Start date</FieldLabel>
        <Input {...getInputProps(f.startDate, { type: "date" })} />
        <FieldError>{f.startDate.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.endDate.valid || undefined}>
        <FieldLabel htmlFor={f.endDate.id}>End date</FieldLabel>
        <Input {...getInputProps(f.endDate, { type: "date" })} />
        <FieldError>{f.endDate.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.includeDomains.valid || undefined}>
        <FieldLabel htmlFor={f.includeDomains.id}>Include domains (comma separated)</FieldLabel>
        <Input {...getInputProps(f.includeDomains, { type: "text" })} placeholder="wikipedia.org" />
        <FieldError>{f.includeDomains.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.includeDomainsMode.valid || undefined}>
        <FieldLabel htmlFor={f.includeDomainsMode.id}>Include domains mode</FieldLabel>
        <Select
          value={includeDomainsModeControl.value ?? "restrict"}
          onValueChange={(v) => includeDomainsModeControl.change(v ?? "restrict")}
        >
          <SelectTrigger
            id={f.includeDomainsMode.id}
            aria-invalid={!f.includeDomainsMode.valid || undefined}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="restrict">restrict</SelectItem>
            <SelectItem value="prefer">prefer</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.includeDomainsMode.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.excludeDomains.valid || undefined}>
        <FieldLabel htmlFor={f.excludeDomains.id}>Exclude domains (comma separated)</FieldLabel>
        <Input {...getInputProps(f.excludeDomains, { type: "text" })} placeholder="example.com" />
        <FieldError>{f.excludeDomains.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.language.valid || undefined}>
        <FieldLabel htmlFor={f.language.id}>Language</FieldLabel>
        <Input {...getInputProps(f.language, { type: "text" })} placeholder="en" />
        <FieldError>{f.language.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.filterByLanguage.valid || undefined}>
        <FieldLabel htmlFor={f.filterByLanguage.id}>Filter by language</FieldLabel>
        <Select
          value={filterByLanguageControl.value ?? ""}
          onValueChange={(v) => filterByLanguageControl.change(v ?? "")}
        >
          <SelectTrigger
            id={f.filterByLanguage.id}
            aria-invalid={!f.filterByLanguage.valid || undefined}
          >
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Default</SelectItem>
            <SelectItem value="true">Enabled</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.filterByLanguage.errors?.[0]}</FieldError>
      </Field>
      <Field data-invalid={!f.safeSearch.valid || undefined}>
        <FieldLabel htmlFor={f.safeSearch.id}>Safe search</FieldLabel>
        <Select
          value={safeSearchControl.value ?? ""}
          onValueChange={(v) => safeSearchControl.change(v ?? "")}
        >
          <SelectTrigger id={f.safeSearch.id} aria-invalid={!f.safeSearch.valid || undefined}>
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Default</SelectItem>
            <SelectItem value="true">Enabled</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>{f.safeSearch.errors?.[0]}</FieldError>
      </Field>
    </>
  );
}
