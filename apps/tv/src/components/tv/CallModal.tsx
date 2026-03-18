"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { TVCall } from "@/types/tv";

const ease = [0.22, 1, 0.36, 1] as const;

interface CallModalProps {
  call: TVCall;
}

export function CallModal({ call }: CallModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        key={call.id}
        className="timeout-overlay"
        style={{ zIndex: 50 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease }}
      >
        <motion.div
          className="glass-strong pulse-glow flex flex-col items-center gap-6 px-16 py-12"
          style={{ borderRadius: "var(--radius-xl)", maxWidth: 800 }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <span className="text-brand-text-muted" style={{ fontSize: "var(--text-call-detail)" }}>
            Chamando
          </span>

          <span
            className="font-display font-bold text-brand-text"
            style={{ fontSize: "var(--text-call-name)" }}
          >
            {call.clientName}
          </span>

          <div className="flex flex-col items-center gap-2">
            <span className="text-brand-text-muted" style={{ fontSize: "var(--text-call-detail)" }}>
              {call.service}
            </span>
            <span className="text-brand-text-muted" style={{ fontSize: "var(--text-subtitle)" }}>
              com <strong className="text-brand-text">{call.professionalName}</strong>
            </span>
          </div>

          <div
            className="glow-cta-lg mt-4 flex items-center justify-center rounded-full bg-cta px-10 py-4 font-display font-bold text-cta-foreground"
            style={{ fontSize: "var(--text-call-detail)" }}
          >
            {call.code}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
