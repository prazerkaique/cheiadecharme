"use client";

import { useReceptionStore } from "@/store/reception-store";
import { Avatar } from "../ui/Avatar";
import { StatusBadge } from "../ui/StatusBadge";
import type { ReceptionProfessional } from "@/types/reception";

interface ProfessionalTileProps {
  professional: ReceptionProfessional;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function ProfessionalTile({ professional, isSelected, onSelect }: ProfessionalTileProps) {
  const toggle = useReceptionStore((s) => s.toggleProfessionalStatus);
  const queue = useReceptionStore((s) => s.queue);

  const currentClient = professional.currentClients.length > 0
    ? queue.find((q) => q.id === professional.currentClients[0])
    : null;

  const completedCount = professional.completedToday;

  return (
    <div
      onClick={onSelect}
      className={`glass rounded-[var(--radius-md)] p-4 transition cursor-pointer ${
        isSelected ? "ring-2 ring-primary ring-offset-1" : "hover:ring-1 hover:ring-primary/30"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <Avatar name={professional.name} url={professional.avatar_url} size="md" />
          <span
            className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full text-[11px] font-bold leading-none bg-emerald-500 text-white ring-2 ring-white"
            title={`${completedCount} atendimentos hoje`}
          >
            {completedCount}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[var(--text-body)] font-semibold text-brand-text">
            {professional.name}
          </h3>
          <p className="text-[var(--text-small)] text-brand-text-muted">
            {professional.specialty}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggle(professional.id);
          }}
          className="shrink-0"
        >
          <StatusBadge status={professional.status} type="professional" />
        </button>
      </div>

      {currentClient && (
        <div className="mt-3 rounded-[var(--radius-sm)] bg-primary/5 border border-primary/10 px-3 py-2">
          <p className="text-[12px] text-brand-text-muted">Atendendo:</p>
          <p className="text-[var(--text-small)] font-semibold text-brand-text truncate">
            {currentClient.client.name.split(" ").slice(0, 2).join(" ")} — {currentClient.service.name}
          </p>
        </div>
      )}

      {professional.queueCount > 0 && !currentClient && (
        <p className="mt-2 text-[12px] text-brand-text-muted">
          {professional.queueCount} na fila
        </p>
      )}
    </div>
  );
}
