"use client";

import type { ProviderFormExtraFieldsProps } from "../provider-form.types";

export function MwmblExtraFields(_props: ProviderFormExtraFieldsProps<"mwmbl">) {
  return (
    <p className="text-sm text-muted-foreground sm:col-span-2">
      Mwmbl search is public. The API key is optional: leave it blank, or use a search-scoped key to
      track usage. An invalid key is ignored and the request falls back to unauthenticated search.
    </p>
  );
}
