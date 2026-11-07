"use client";

import { cn } from "cn";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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
  const [failed, setFailed] = useState(false);
  const { resolvedTheme } = useTheme();
  const icon: { light: string; dark?: string } | undefined = type
    ? PROVIDER_REGISTRY[type].icon
    : undefined;
  const src: string | undefined =
    icon && resolvedTheme === "dark" && icon.dark ? icon.dark : icon?.light;
  useEffect(() => {
    setFailed(false);
  }, [src]);
  return (
    <Badge
      variant="outline"
      className={cn("h-6 px-3 py-1", !bordered && "border-transparent", badgeClassName)}
    >
      {!src || failed ? (
        <span
          aria-hidden
          className={cn(
            "flex shrink-0 items-center justify-center bg-teal-700 font-semibold text-white",
            className ?? "h-4 w-4 text-xs",
          )}
        >
          {(type || "?").slice(0, 1).toUpperCase()}
        </span>
      ) : (
        <img
          src={src}
          alt={type ?? "?"}
          loading="lazy"
          onError={() => setFailed(true)}
          className={cn("h-4 w-4 shrink-0 object-contain", className)}
        />
      )}
      {label ?? (type ? PROVIDER_REGISTRY[type].label : "?")}
    </Badge>
  );
}
