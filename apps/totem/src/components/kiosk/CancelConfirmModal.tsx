"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CancelConfirmModalProps {
  onConfirmCancel: () => void;
  onGoBack: () => void;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.22, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: "easeIn" },
  },
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

export default function CancelConfirmModal({
  onConfirmCancel,
  onGoBack,
}: CancelConfirmModalProps) {
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
        aria-label="Confirmar cancelamento"
      >
        <motion.div
          className="glass-strong w-full flex flex-col items-center mx-6"
          style={{
            maxWidth: "680px",
            borderRadius: "32px",
            padding: "60px",
            gap: "20px",
          }}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* ---------------------------------------------------------------- */}
          {/* Warning icon                                                      */}
          {/* ---------------------------------------------------------------- */}
          <div
            className="flex items-center justify-center rounded-full shrink-0"
            style={{
              width: "88px",
              height: "88px",
              background: "rgba(239,68,68,0.10)",
              border: "1.5px solid rgba(239,68,68,0.25)",
            }}
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-error"
              style={{ width: "44px", height: "44px" }}
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Heading                                                           */}
          {/* ---------------------------------------------------------------- */}
          <h2
            className="font-display text-brand-text text-center"
            style={{ fontSize: "44px", lineHeight: 1.15, letterSpacing: "-0.01em" }}
          >
            Deseja realmente cancelar?
          </h2>

          {/* ---------------------------------------------------------------- */}
          {/* Subtext                                                           */}
          {/* ---------------------------------------------------------------- */}
          <p
            className="font-body text-brand-text-muted text-center"
            style={{ fontSize: "28px", lineHeight: 1.4 }}
          >
            Seu progresso será perdido
          </p>

          {/* Thin gradient divider */}
          <div
            aria-hidden="true"
            className="w-full"
            style={{
              height: "1px",
              margin: "8px 0",
              background:
                "linear-gradient(to right, transparent, rgba(239,68,68,0.20), transparent)",
            }}
          />

          {/* ---------------------------------------------------------------- */}
          {/* Action buttons                                                    */}
          {/* ---------------------------------------------------------------- */}
          <div
            className="w-full flex flex-col"
            style={{ gap: "32px" }}
          >
            {/* Sim, cancelar — destructive glass (listed first / above) */}
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                onConfirmCancel();
              }}
              className="w-full flex items-center justify-center glass-strong font-body font-semibold text-error active:scale-[0.98] transition-all duration-150"
              style={{
                minHeight: "90px",
                borderRadius: "22px",
                fontSize: "26px",
                background: "rgba(239,68,68,0.10)",
                border: "1.5px solid rgba(239,68,68,0.30)",
              }}
            >
              Sim, cancelar
            </button>

            {/* Não, continuar — primary CTA */}
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                onGoBack();
              }}
              className="w-full flex items-center justify-center glow-cta ring-1 ring-white/20 text-white font-body font-semibold tracking-wide active:scale-[0.98] transition-all duration-150"
              style={{
                minHeight: "120px",
                borderRadius: "22px",
                fontSize: "34px",
                background: "linear-gradient(to right, #C2185B, #D94B8C)",
              }}
            >
              Não, continuar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
