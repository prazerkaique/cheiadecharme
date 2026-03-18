"use client";

import { motion } from "framer-motion";
import { Gem } from "lucide-react";
import { useClientStore } from "@/store/client-store";

const ease = [0.22, 1, 0.36, 1] as const;

export function CharmesBalance() {
  const charmes = useClientStore((s) => s.charmes);
  const navigate = useClientStore((s) => s.navigate);
  const setActiveTab = useClientStore((s) => s.setActiveTab);

  const balance = charmes?.balance ?? 0;

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.15 }}
      onPointerDown={(e) => {
        e.preventDefault();
        setActiveTab("charmes");
      }}
      className="w-full glass-strong rounded-2xl p-4 flex items-center gap-4 text-left hover:shadow-lg transition-shadow"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cta flex items-center justify-center shrink-0">
        <Gem className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-brand-text-muted font-semibold">Seus Charmes</p>
        <p className="text-2xl font-display font-bold text-brand-text">{balance}</p>
      </div>
      <span className="text-xs text-cta font-semibold">Ver extrato →</span>
    </motion.button>
  );
}
