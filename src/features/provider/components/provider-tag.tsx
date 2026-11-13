"use client";

import { cn } from "cn";

import { Badge } from "@/shared/components/ui/badge";

import { PROVIDER_REGISTRY, type ProviderType } from "../model/provider";

interface Props {
  type: ProviderType | null;
  label?: string;
  className?: string;
  bordered?: boolean;
  badgeClassName?: string;
}

export function ProviderTag({ type, label, className, bordered = true, badgeClassName }: Props) {
  const icon: { light: string; dark?: string } | undefined = type
    ? PROVIDER_REGISTRY[type].icon
    : undefined;
  return (
    <Badge
      variant="outline"
      className={cn("h-6 px-3 py-1", !bordered && "border-transparent", badgeClassName)}
    >
      {!icon ? (
        <span
          aria-hidden
          className={cn(
            "flex shrink-0 items-center justify-center bg-teal-700 font-semibold text-white",
            className ?? "h-4 w-4 text-xs",
          )}
        >
          {(type || "?").slice(0, 1).toUpperCase()}
        </span>
      ) : icon.dark ? (
        <>
          <img
            src={icon.light}
            alt={type ?? "?"}
            loading="lazy"
            className={cn("h-4 w-4 shrink-0 object-contain dark:hidden", className)}
          />
          <img
            src={icon.dark}
            alt={type ?? "?"}
            loading="lazy"
            className={cn("hidden h-4 w-4 shrink-0 object-contain dark:block", className)}
          />
        </>
      ) : (
        <img
          src={icon.light}
          alt={type ?? "?"}
          loading="lazy"
          className={cn("h-4 w-4 shrink-0 object-contain", className)}
        />
      )}
      {label ?? (type ? PROVIDER_REGISTRY[type].label : "?")}
    </Badge>
  );
}
