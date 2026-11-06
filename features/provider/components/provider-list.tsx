"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import type { ProviderOutput } from "../model/provider";
import { ProviderItem } from "./provider-item";

interface Props {
  items: ProviderOutput[];
  tz: string;
  onToggle: (id: string) => void;
  onEdit: (provider: ProviderOutput) => void;
  onDelete: (provider: ProviderOutput) => void;
  onDragEnd: (e: DragEndEvent) => void;
}

export function ProviderList({ items, tz, onToggle, onEdit, onDelete, onDragEnd }: Props) {
  const sensors = useSensors(useSensor(PointerSensor));
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((x) => x.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {items.map((provider, i) => (
            <div key={provider.id} className="flex items-center gap-2">
              <span className="w-6 shrink-0 text-center text-sm text-muted-foreground">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <ProviderItem
                  provider={provider}
                  tz={tz}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">No providers yet. Use Add to register.</p>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
