"use client";

import { motion } from "framer-motion";

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel: string;
  variant?: "primary" | "destructive";
  onConfirm: () => void;
  onCancel: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  variant = "primary",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="overlay-backdrop" onClick={onCancel}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong mx-4 w-full max-w-sm rounded-[var(--radius-lg)] p-6"
      >
        <h3 className="font-display text-[var(--text-subtitle)] font-semibold text-brand-text">
          {title}
        </h3>
        <p className="mt-2 text-[var(--text-body)] text-brand-text-muted">
          {description}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-[var(--radius-md)] border border-brand-border bg-white/60 py-2.5 text-[var(--text-body)] font-semibold text-brand-text transition hover:bg-white/80"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-[var(--radius-md)] py-2.5 text-[var(--text-body)] font-semibold text-white transition ${
              variant === "destructive"
                ? "bg-error hover:bg-red-600"
                : "bg-cta hover:bg-cta-soft glow-cta"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
