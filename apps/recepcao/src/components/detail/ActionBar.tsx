"use client";

import { useReceptionStore } from "@/store/reception-store";
import type { QueueItem } from "@/types/reception";
import { XCircle, UserPlus } from "lucide-react";

interface ActionBarProps {
  item: QueueItem;
}

export function ActionBar({ item }: ActionBarProps) {
  const setConfirmDialog = useReceptionStore((s) => s.setConfirmDialog);
  const setShowAssignSheet = useReceptionStore((s) => s.setShowAssignSheet);

  const canAssign = item.status === "checked_in" || item.status === "waiting" || item.status === "scheduled";
  const canNoShow = item.status === "checked_in" || item.status === "waiting" || item.status === "scheduled";

  return (
    <div className="flex flex-col gap-2">
      {canAssign && (
        <button
          onClick={() => setShowAssignSheet(true)}
          className="flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-brand-border bg-white/60 py-2.5 text-[var(--text-body)] font-semibold text-brand-text transition hover:bg-white/80"
        >
          <UserPlus size={16} />
          {item.professional_id ? "Trocar Profissional" : "Atribuir Profissional"}
        </button>
      )}

      {canNoShow && (
        <button
          onClick={() => setConfirmDialog({ type: "no_show", appointmentId: item.id })}
          className="flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-error/30 bg-error/5 py-2.5 text-[var(--text-body)] font-semibold text-error transition hover:bg-error/10"
        >
          <XCircle size={16} />
          Marcar No-Show
        </button>
      )}
    </div>
  );
}
