"use client";

import { useState } from "react";
import { useReceptionStore } from "@/store/reception-store";
import { Megaphone, X } from "lucide-react";
import { motion } from "framer-motion";

interface CallButtonProps {
  appointmentId: string;
  clientName: string;
  disabled?: boolean;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function CallButton({ appointmentId, clientName, disabled }: CallButtonProps) {
  const callClient = useReceptionStore((s) => s.callClient);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = () => {
    callClient(appointmentId);
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="flex flex-col gap-2 rounded-[var(--radius-lg)] border border-cta/20 bg-cta/5 p-3">
        <p className="text-center text-[var(--text-body)] font-semibold text-brand-text">
          Chamar <span className="text-cta">{clientName}</span> na TV?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowConfirm(false)}
            className="flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-brand-border bg-white/60 py-2.5 text-[var(--text-body)] font-semibold text-brand-text-muted transition hover:bg-white/80"
          >
            <X size={16} />
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-cta py-2.5 text-[var(--text-body)] font-bold text-white transition hover:bg-cta/90"
          >
            <Megaphone size={16} />
            Chamar
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15, ease }}
      onClick={() => setShowConfirm(true)}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-3 rounded-[var(--radius-lg)] bg-cta py-4 text-[var(--text-subtitle)] font-bold text-white pulse-glow transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Megaphone size={22} />
      Chamar Cliente na TV
    </motion.button>
  );
}
