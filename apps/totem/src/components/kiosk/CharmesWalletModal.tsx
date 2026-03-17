"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { formatCharmes } from "@/lib/format";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CharmesTransaction {
  id: string;
  label: string;
  amount: number;
  date: string;
}

export interface CharmesWalletModalProps {
  balance: number;
  transactions: CharmesTransaction[];
  onBuyMore: () => void;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Mock transactions
// ---------------------------------------------------------------------------

export const MOCK_TRANSACTIONS: CharmesTransaction[] = [
  { id: "t1", label: "Corte Feminino", amount: -80, date: "há 3 dias" },
  { id: "t2", label: "Recarga Pix", amount: 200, date: "há 7 dias" },
  { id: "t3", label: "Manicure Completa", amount: -45, date: "há 10 dias" },
  { id: "t4", label: "Recarga Pix", amount: 300, date: "há 15 dias" },
];

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

export default function CharmesWalletModal({
  balance,
  transactions,
  onBuyMore,
  onClose,
}: CharmesWalletModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="timeout-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-label="Meus Charmes"
      >
        <motion.div
          className="glass-strong w-full flex flex-col items-center gap-8 mx-6"
          style={{
            maxWidth: "680px",
            borderRadius: "32px",
            padding: "48px 40px",
          }}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Title */}
          <h2
            className="font-display text-brand-text text-center leading-tight"
            style={{ fontSize: "40px", letterSpacing: "-0.01em" }}
          >
            Meus Charmes
          </h2>

          {/* Balance highlight */}
          <div
            className="w-full flex items-center justify-center gap-3 py-6 rounded-[20px]"
            style={{
              background: "linear-gradient(135deg, rgba(194,24,91,0.08), rgba(217,75,140,0.12))",
              border: "1.5px solid rgba(194,24,91,0.15)",
            }}
          >
            <span className="text-[32px] leading-none text-cta">✦</span>
            <span className="text-[48px] font-body font-bold text-cta leading-none">
              {formatCharmes(balance)}
            </span>
          </div>

          {/* Section: Últimas Transações */}
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div
                aria-hidden="true"
                className="flex-1 h-px"
                style={{
                  background: "linear-gradient(to right, transparent, rgba(217,75,140,0.25))",
                }}
              />
              <span className="text-[22px] font-body font-semibold text-brand-text-muted uppercase tracking-[0.12em]">
                Últimas Transações
              </span>
              <div
                aria-hidden="true"
                className="flex-1 h-px"
                style={{
                  background: "linear-gradient(to left, transparent, rgba(217,75,140,0.25))",
                }}
              />
            </div>

            {/* Transaction list */}
            <div className="w-full flex flex-col gap-0 max-h-[320px] overflow-y-auto scrollbar-branded">
              {transactions.map((tx, idx) => (
                <div key={tx.id}>
                  <div className="flex items-center justify-between py-4 px-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[26px] font-body font-medium text-brand-text">
                        {tx.label}
                      </span>
                      <span className="text-[20px] font-body text-brand-text-muted">
                        {tx.date}
                      </span>
                    </div>
                    <span
                      className={[
                        "text-[28px] font-body font-bold",
                        tx.amount < 0 ? "text-red-500" : "text-success",
                      ].join(" ")}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {formatCharmes(tx.amount)}
                    </span>
                  </div>
                  {idx < transactions.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="w-full h-px"
                      style={{
                        background:
                          "linear-gradient(to right, transparent, rgba(217,75,140,0.15), transparent)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA: Comprar mais Charmes */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              onBuyMore();
            }}
            className="w-full flex items-center justify-center gap-3 glow-cta ring-1 ring-white/20 text-white font-body font-semibold tracking-wide active:scale-[0.98] transition-all duration-150"
            style={{
              minHeight: "100px",
              borderRadius: "22px",
              fontSize: "30px",
              background: "linear-gradient(to right, #C2185B, #D94B8C)",
            }}
          >
            Comprar mais Charmes ✦
          </button>

          {/* Secondary: Fechar */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              onClose();
            }}
            className="w-full flex items-center justify-center glass-strong border border-brand-border text-brand-text font-body font-medium active:scale-[0.98] transition-all duration-150"
            style={{
              minHeight: "80px",
              borderRadius: "22px",
              fontSize: "26px",
            }}
          >
            Fechar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
