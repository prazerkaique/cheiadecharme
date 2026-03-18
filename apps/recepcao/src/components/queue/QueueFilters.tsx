"use client";

import { useReceptionStore } from "@/store/reception-store";
import type { QueueFilter } from "@/types/reception";

const FILTERS: { id: QueueFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "waiting", label: "Esperando" },
  { id: "in_progress", label: "Atendendo" },
  { id: "scheduled", label: "Agendados" },
  { id: "completed", label: "Atendidos" },
];

export function QueueFilters() {
  const filter = useReceptionStore((s) => s.queueFilter);
  const setFilter = useReceptionStore((s) => s.setQueueFilter);

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.id}
          onClick={() => setFilter(f.id)}
          className={`rounded-full px-3 py-1 text-[12px] font-bold transition ${
            filter === f.id
              ? "bg-primary text-white"
              : "bg-white/60 text-brand-text-muted border border-brand-border hover:bg-white/80"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
