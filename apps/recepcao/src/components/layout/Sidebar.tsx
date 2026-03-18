"use client";

import { QueueFilters } from "../queue/QueueFilters";
import { SearchInput } from "../ui/SearchInput";
import { QueueList } from "../queue/QueueList";

export function Sidebar() {
  return (
    <aside className="flex w-[var(--rec-sidebar-w)] shrink-0 flex-col border-r border-brand-border">
      <div className="flex flex-col gap-3 p-4 pb-2">
        <h2 className="font-display text-[var(--text-subtitle)] font-semibold text-brand-text">
          Fila de Clientes
        </h2>
        <SearchInput />
        <QueueFilters />
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin">
        <QueueList />
      </div>
    </aside>
  );
}
