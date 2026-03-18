"use client";

import { useReceptionStore } from "@/store/reception-store";
import type { TabId } from "@/types/reception";
import { Users, LayoutGrid, Clock } from "lucide-react";

const TABS: { id: TabId; label: string; icon: typeof Users }[] = [
  { id: "fila", label: "Clientes", icon: Users },
  { id: "profissionais", label: "Profissionais", icon: LayoutGrid },
  { id: "historico", label: "Historico", icon: Clock },
];

export function MobileTabBar() {
  const activeTab = useReceptionStore((s) => s.activeTab);
  const setActiveTab = useReceptionStore((s) => s.setActiveTab);
  const selectedId = useReceptionStore((s) => s.selectedAppointmentId);
  const selectAppointment = useReceptionStore((s) => s.selectAppointment);

  return (
    <nav className="glass-strong flex h-[var(--rec-mobile-tabbar-h)] shrink-0 border-t border-brand-border">
      {selectedId ? (
        <button
          onClick={() => selectAppointment(null)}
          className="flex flex-1 items-center justify-center gap-2 text-[var(--text-body)] font-semibold text-primary"
        >
          ← Voltar
        </button>
      ) : (
        TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? "text-primary" : "text-brand-text-muted"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] font-semibold">{tab.label}</span>
            </button>
          );
        })
      )}
    </nav>
  );
}
