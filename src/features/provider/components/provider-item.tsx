"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, EllipsisVertical, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Switch } from "@/shared/components/ui/switch";
import { fmtTime } from "@/shared/lib/format-date-time";

import type { ProviderOutput } from "../model/provider";
import { ProviderTag } from "./provider-tag";

interface Props {
  provider: ProviderOutput;
  tz: string;
  onToggle: (id: string) => void;
  onEdit: (provider: ProviderOutput) => void;
  onDelete: (provider: ProviderOutput) => void;
}

export function ProviderItem({ provider, tz, onToggle, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: provider.id,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3 sm:gap-3"
    >
      <button
        className="cursor-grab touch-none text-muted-foreground"
        aria-label="Reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate font-medium">{provider.name}</p>
        <div className="flex flex-wrap items-center gap-2">
          <ProviderTag type={provider.type} />
          {provider.cooldownUntil && provider.coolingDown && (
            <Badge
              variant="outline"
              className="border-amber-500/30 bg-amber-500/5 font-normal text-amber-700 dark:text-amber-300"
            >
              Cooling down until {fmtTime(provider.cooldownUntil, tz)}
            </Badge>
          )}
        </div>
      </div>
      <div className="flex items-center">
        <Switch
          checked={provider.enabled}
          onCheckedChange={() => onToggle(provider.id)}
          aria-label="Toggle enabled"
          className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-200 dark:data-[state=checked]:bg-green-600 dark:data-[state=unchecked]:bg-gray-700"
        />
      </div>
      <div aria-hidden className="mx-2 h-6 w-px self-center bg-border" />
      <div className="hidden items-center gap-0.5 sm:flex">
        <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => onEdit(provider)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => onDelete(provider)}>
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Actions"
            className={buttonVariants({ variant: "ghost", size: "icon" }) + " cursor-pointer"}
          >
            <EllipsisVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(provider)}>
              <Pencil className="h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(provider)} className="text-red-600">
              <Trash2 className="h-4 w-4 text-red-600" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
