"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Shuffle } from "lucide-react";
import { useClientStore } from "@/store/client-store";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProfessionalPicker() {
  const selectedCategory = useClientStore((s) => s.selectedCategory);
  const allProfessionals = useClientStore((s) => s.professionals);
  const selectProfessional = useClientStore((s) => s.selectProfessional);

  const professionals = useMemo(
    () => selectedCategory ? allProfessionals.filter((p) => p.specialty === selectedCategory) : [],
    [allProfessionals, selectedCategory]
  );

  return (
    <div className="space-y-3">
      <h3 className="text-base font-display font-semibold text-brand-text px-1">
        Escolha o profissional
      </h3>

      {/* Any available option */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
        onPointerDown={(e) => { e.preventDefault(); selectProfessional(null); }}
        className="w-full glass-strong rounded-xl p-4 flex items-center gap-3 hover:shadow-lg transition-shadow text-left border-2 border-dashed border-brand-border"
      >
        <div className="w-11 h-11 rounded-full bg-secondary/40 flex items-center justify-center">
          <Shuffle className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-display font-semibold text-brand-text">
            Qualquer disponivel
          </p>
          <p className="text-xs text-brand-text-muted">Primeiro profissional livre</p>
        </div>
      </motion.button>

      <div className="space-y-2">
        {professionals.map((prof, i) => (
          <motion.button
            key={prof.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease, delay: (i + 1) * 0.05 }}
            onPointerDown={(e) => { e.preventDefault(); selectProfessional(prof.id); }}
            className="w-full glass-strong rounded-xl p-4 flex items-center gap-3 hover:shadow-lg transition-shadow text-left"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-cta flex items-center justify-center text-white font-bold text-sm">
              {prof.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <p className="text-sm font-display font-semibold text-brand-text">{prof.name}</p>
              <p className="text-xs text-brand-text-muted">{prof.specialty}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
