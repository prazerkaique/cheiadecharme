"use client";

import { useReceptionStore } from "@/store/reception-store";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { MobileTabBar } from "./MobileTabBar";
import { QueueList } from "../queue/QueueList";
import { ProfessionalGrid } from "../professional/ProfessionalGrid";
import { ClientDetailPanel } from "../detail/ClientDetailPanel";
import { HistoryList } from "../history/HistoryList";

export function AppShell() {
  const activeTab = useReceptionStore((s) => s.activeTab);
  const selectedId = useReceptionStore((s) => s.selectedAppointmentId);

  return (
    <div className="flex h-full flex-col">
      <TopBar />

      {/* Desktop layout: 3 columns */}
      <div className="hidden flex-1 overflow-hidden md:flex">
        {/* Sidebar — Queue */}
        <Sidebar />

        {/* Main area */}
        <main className="flex-1 overflow-y-auto bg-white p-4 scrollbar-thin">
          {activeTab === "historico" ? (
            <HistoryList />
          ) : (
            <ProfessionalGrid />
          )}
        </main>

        {/* Detail panel */}
        {selectedId && (
          <aside className="w-[var(--rec-detail-w)] shrink-0 border-l border-brand-border overflow-y-auto scrollbar-thin">
            <ClientDetailPanel />
          </aside>
        )}
      </div>

      {/* Mobile layout: full-screen content + bottom tabs */}
      <div className="flex flex-1 flex-col overflow-hidden md:hidden">
        <main className="flex-1 overflow-y-auto p-3 scrollbar-thin">
          {selectedId ? (
            <ClientDetailPanel />
          ) : activeTab === "fila" ? (
            <QueueList />
          ) : activeTab === "profissionais" ? (
            <ProfessionalGrid />
          ) : (
            <HistoryList />
          )}
        </main>
        <MobileTabBar />
      </div>
    </div>
  );
}
