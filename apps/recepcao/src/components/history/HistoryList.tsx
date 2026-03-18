"use client";

import { useReceptionStore } from "@/store/reception-store";
import { HistoryCard } from "./HistoryCard";
import { Inbox } from "lucide-react";

export function HistoryList() {
  // Subscribe to queue so we re-render when data changes
  useReceptionStore((s) => s.queue);
  const getHistory = useReceptionStore((s) => s.getHistory);
  const items = getHistory();

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-display text-[var(--text-subtitle)] font-semibold text-brand-text mb-2 md:hidden">
        Historico de Hoje
      </h2>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Inbox size={40} className="text-brand-text-muted/40" />
          <p className="mt-3 text-[var(--text-body)] font-semibold text-brand-text-muted">
            Nenhum atendimento finalizado
          </p>
        </div>
      ) : (
        items.map((item) => <HistoryCard key={item.id} item={item} />)
      )}
    </div>
  );
}
