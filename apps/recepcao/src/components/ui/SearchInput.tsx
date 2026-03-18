"use client";

import { useReceptionStore } from "@/store/reception-store";
import { Search, X } from "lucide-react";

export function SearchInput() {
  const searchQuery = useReceptionStore((s) => s.searchQuery);
  const setSearchQuery = useReceptionStore((s) => s.setSearchQuery);

  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar nome ou senha..."
        className="w-full rounded-[var(--radius-md)] border border-brand-border bg-white/60 py-2 pl-9 pr-8 text-[var(--text-small)] text-brand-text placeholder:text-brand-text-muted/60 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-brand-text-muted hover:bg-brand-border transition"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
