"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ShieldCheck } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ClaimConfirmModalProps {
  clientName: string;
  maskedCpf: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: "easeIn" } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: { duration: 0.20, ease: "easeIn" as const },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ClaimConfirmModal({
  clientName,
  maskedCpf,
  onConfirm,
  onCancel,
}: ClaimConfirmModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="timeout-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="alertdialog"
        aria-modal="true"
        aria-label="Confirmação de identidade"
      >
        <motion.div
          className="glass-strong w-full flex flex-col items-center gap-10 mx-6"
          style={{ maxWidth: "680px", borderRadius: "32px", padding: "60px" }}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Icon */}
          <div
            className="flex items-center justify-center w-28 h-28 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(194,24,91,0.10))",
              border: "2px solid rgba(139,92,246,0.3)",
            }}
          >
            <ShieldCheck size={56} className="text-purple" />
          </div>

          {/* Title */}
          <h2
            className="font-display text-brand-text text-center"
            style={{ fontSize: "44px", lineHeight: 1.15, letterSpacing: "-0.01em" }}
          >
            Confirme sua identidade
          </h2>

          {/* Client info */}
          <div className="w-full flex flex-col items-center gap-4">
            <p className="font-body font-bold text-brand-text text-center" style={{ fontSize: "36px" }}>
              {clientName}
            </p>
            <p
              className="font-body text-brand-text-muted text-center tabular-nums"
              style={{ fontSize: "28px", letterSpacing: "0.05em" }}
            >
              CPF: {maskedCpf}
            </p>
          </div>

          {/* Buttons */}
          <div className="w-full flex flex-col" style={{ gap: "24px" }}>
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                onConfirm();
              }}
              className="w-full flex items-center justify-center min-h-[110px] rounded-[22px] text-[32px] font-semibold font-body text-white active:scale-[0.98] transition-transform ring-1 ring-white/20"
              style={{
                background: "linear-gradient(to right, #8B5CF6, #C2185B)",
                boxShadow: "0 0 20px rgba(139,92,246,0.30), 0 4px 16px rgba(194,24,91,0.20)",
              }}
            >
              Sou eu! Resgatar
            </button>

            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                onCancel();
              }}
              className="w-full flex items-center justify-center min-h-[90px] rounded-[22px] text-[26px] font-body text-brand-text-muted active:scale-[0.98] transition-transform glass-strong border border-brand-border"
            >
              Não sou eu
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
