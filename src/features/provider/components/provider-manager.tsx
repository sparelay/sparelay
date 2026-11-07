"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { deleteProvider } from "@/features/provider/actions/delete-provider";
import { listProviders } from "@/features/provider/actions/list-providers";
import { reorderProviders } from "@/features/provider/actions/reorder-providers";
import { toggleProvider } from "@/features/provider/actions/toggle-provider";
import { buttonVariants } from "@/shared/components/ui/button";

import type { ProviderOutput } from "../model/provider";
import { ProviderDeleteDialog } from "./provider-delete-dialog";
import { ProviderList } from "./provider-list";

interface Props {
  tz: string;
}

export function ProviderManager({ tz }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<ProviderOutput[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<ProviderOutput | null>(null);

  const load = useCallback(async () => {
    const res = await listProviders();
    if (!res.success) {
      toast.error("Failed to load");
      return;
    }
    setItems(res.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleEdit = (provider: ProviderOutput) => {
    router.push(`/providers/${provider.id}/edit`);
  };

  const handleDelete = (provider: ProviderOutput) => {
    setDeleteTarget(provider);
  };

  const handleToggle = async (id: string) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x)));
    const res = await toggleProvider(id);
    if (!res.success || !res.data) {
      toast.error(res.message || "Update failed");
      load();
      return;
    }
    setItems((prev) => prev.map((x) => (x.id === id ? res.data : x)));
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((x) => x.id === active.id);
    const newIndex = items.findIndex((x) => x.id === over.id);
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    const res = await reorderProviders(next.map((x) => x.id));
    if (!res.success) {
      toast.error("Failed to save order");
      load();
    } else {
      setItems(res.data);
      toast.success(res.message || "Order saved");
    }
  };

  const handleConfirm = async () => {
    if (!deleteTarget) return;
    const res = await deleteProvider(deleteTarget.id);
    if (!res.success) {
      toast.error("Delete failed");
      return;
    }
    toast.success(res.message || "Deleted");
    setDeleteTarget(null);
    load();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Link href="/providers/new" className={buttonVariants()}>
          <Plus className="h-4 w-4" /> Add
        </Link>
      </div>

      <ProviderList
        items={items}
        tz={tz}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDragEnd={handleDragEnd}
      />

      <ProviderDeleteDialog
        provider={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
