"use client";

import { useShallow } from "zustand/react/shallow";
import { useTVStore } from "@/store/tv-store";
import type { TVCategory } from "@/types/tv";
import { ProfessionalCard } from "./ProfessionalCard";

interface CategoryColumnProps {
  category: TVCategory;
}

export function CategoryColumn({ category }: CategoryColumnProps) {
  const professionals = useTVStore(
    useShallow((s) => s.professionals.filter((p) => p.categoryId === category.id))
  );

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div
        className="glass-strong flex items-center justify-center py-2 font-display font-bold text-brand-text"
        style={{ borderRadius: "var(--radius-md)", fontSize: "var(--text-subtitle)" }}
      >
        {category.name}
      </div>

      <div className="flex flex-col gap-2">
        {professionals.map((prof) => (
          <ProfessionalCard key={prof.id} professional={prof} />
        ))}
      </div>
    </div>
  );
}
