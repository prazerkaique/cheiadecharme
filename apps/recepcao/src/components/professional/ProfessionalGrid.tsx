"use client";

import { useState } from "react";
import { useReceptionStore } from "@/store/reception-store";
import { ProfessionalTile } from "./ProfessionalTile";
import { ProfessionalDetailCard } from "./ProfessionalDetailCard";
import { AnimatePresence, motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProfessionalGrid() {
  const getSortedProfessionals = useReceptionStore((s) => s.getSortedProfessionals);
  const professionals = useReceptionStore((s) => s.professionals);
  const selectedProfessionalId = useReceptionStore((s) => s.selectedProfessionalId);
  const selectProfessional = useReceptionStore((s) => s.selectProfessional);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Get unique categories from raw list (preserve order)
  const categories = Array.from(new Set(professionals.map((p) => p.specialty)));

  const sorted = getSortedProfessionals(categoryFilter !== "all" ? categoryFilter : undefined);
  const filtered =
    categoryFilter === "all"
      ? sorted
      : sorted.filter((p) => p.specialty === categoryFilter);

  return (
    <div className="flex flex-col gap-4">
      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategoryFilter("all")}
          className={`rounded-full px-3 py-1 text-[12px] font-bold transition ${
            categoryFilter === "all"
              ? "bg-primary text-white"
              : "bg-white/60 text-brand-text-muted border border-brand-border hover:bg-white/80"
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-full px-3 py-1 text-[12px] font-bold transition ${
              categoryFilter === cat
                ? "bg-primary text-white"
                : "bg-white/60 text-brand-text-muted border border-brand-border hover:bg-white/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid with expandable detail card */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {filtered.map((p) => {
          const isSelected = selectedProfessionalId === p.id;
          return (
            <div key={p.id} className="contents md:block">
              <ProfessionalTile
                professional={p}
                isSelected={isSelected}
                onSelect={() => selectProfessional(p.id)}
              />
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease }}
                    className="overflow-hidden"
                  >
                    <div className="glass rounded-b-[var(--radius-md)] -mt-1 border-t border-brand-border/30 pt-3">
                      <ProfessionalDetailCard professional={p} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
