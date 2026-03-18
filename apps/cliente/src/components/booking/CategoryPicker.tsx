"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Scissors, Sparkles, Eye, Palette, Droplets } from "lucide-react";
import { useClientStore } from "@/store/client-store";
import type { LucideIcon } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Cabelo: Scissors,
  Unhas: Sparkles,
  Sobrancelha: Eye,
  Maquiagem: Palette,
  Depilacao: Droplets,
};

const CATEGORY_COLORS: Record<string, string> = {
  Cabelo: "from-primary to-cta",
  Unhas: "from-pink-400 to-rose-500",
  Sobrancelha: "from-amber-400 to-orange-500",
  Maquiagem: "from-violet-400 to-purple-500",
  Depilacao: "from-teal-400 to-emerald-500",
};

export function CategoryPicker() {
  const services = useClientStore((s) => s.services);
  const selectCategory = useClientStore((s) => s.selectCategory);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    services.forEach((s) => map.set(s.category, (map.get(s.category) ?? 0) + 1));
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [services]);

  return (
    <div className="space-y-3">
      <h3 className="text-base font-display font-semibold text-brand-text px-1">
        Escolha a categoria
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {categories.map(({ name, count }, i) => {
          const Icon = CATEGORY_ICONS[name] ?? Scissors;
          const color = CATEGORY_COLORS[name] ?? "from-primary to-cta";
          return (
            <motion.button
              key={name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease, delay: i * 0.05 }}
              onPointerDown={(e) => { e.preventDefault(); selectCategory(name); }}
              className="glass-strong rounded-xl p-4 flex flex-col items-start gap-3 hover:shadow-lg transition-shadow text-left"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                <Icon className="w-5.5 h-5.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-display font-semibold text-brand-text">{name}</p>
                <p className="text-xs text-brand-text-muted">{count} servicos</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
