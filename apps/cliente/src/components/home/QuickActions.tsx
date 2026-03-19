"use client";

import { motion } from "framer-motion";
import { CalendarPlus, Gem, Tag, Trophy } from "lucide-react";
import { useClientStore } from "@/store/client-store";

const ease = [0.22, 1, 0.36, 1] as const;

const ACTIONS = [
  { id: "booking" as const, label: "Agendar", icon: CalendarPlus, color: "from-cta to-primary" },
  { id: "charmes" as const, label: "Charmes", icon: Gem, color: "from-primary to-primary-soft" },
  { id: "promotions" as const, label: "Promocoes", icon: Tag, color: "from-warning to-warning" },
  { id: "prizes" as const, label: "Premios", icon: Trophy, color: "from-success to-success" },
] as const;

export function QuickActions() {
  const setActiveTab = useClientStore((s) => s.setActiveTab);
  const navigate = useClientStore((s) => s.navigate);

  const handleAction = (id: string) => {
    if (id === "booking") setActiveTab("booking");
    else if (id === "charmes") setActiveTab("charmes");
    else navigate(id as "promotions" | "prizes");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.2 }}
      className="grid grid-cols-4 gap-3"
    >
      {ACTIONS.map(({ id, label, icon: Icon, color }) => (
        <button
          key={id}
          onPointerDown={(e) => { e.preventDefault(); handleAction(id); }}
          className="flex flex-col items-center gap-2 py-3 rounded-xl hover:bg-surface transition-colors"
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-semibold text-brand-text">{label}</span>
        </button>
      ))}
    </motion.div>
  );
}
