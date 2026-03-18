"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CircleCheckBig } from "lucide-react";
import { useGameStore } from "@/store/game-store";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const AUTO_RESET_MS = 10_000;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ClaimedScreen() {
  const wonPrize = useGameStore((s) => s.wonPrize);
  const client = useGameStore((s) => s.client);
  const reset = useGameStore((s) => s.reset);

  // Auto-reset to idle
  useEffect(() => {
    const timer = setTimeout(reset, AUTO_RESET_MS);
    return () => clearTimeout(timer);
  }, [reset]);

  return (
    <div className="relative flex flex-col items-center w-full h-screen gradient-mesh overflow-hidden">
      {/* Content */}
      <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-center gap-10 px-[60px]">
        {/* Check icon with glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div
            aria-hidden="true"
            className="absolute inset-[-50%] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="relative flex items-center justify-center w-40 h-40 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))",
              border: "2px solid rgba(16,185,129,0.35)",
            }}
          >
            <CircleCheckBig size={72} className="text-success" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" as const }}
          className="flex flex-col items-center gap-4"
        >
          <h1 className="font-display text-[56px] font-bold text-brand-text text-center leading-tight">
            Prêmio Resgatado!
          </h1>
          <p className="font-body text-[26px] text-brand-text-muted text-center max-w-[540px]">
            Seu prêmio já está disponível no app Cheia de Charme
          </p>
        </motion.div>

        {/* Prize summary card */}
        {wonPrize && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" as const }}
            className="glass-strong w-full max-w-[540px] flex flex-col items-center gap-3 border border-brand-border"
            style={{ borderRadius: "24px", padding: "36px 40px" }}
          >
            <p className="font-body font-bold text-brand-text text-center" style={{ fontSize: "32px" }}>
              {wonPrize.label}
            </p>
            <p className="font-body text-brand-text-muted text-center" style={{ fontSize: "22px" }}>
              {wonPrize.type === "charmes" && `+${wonPrize.value} Charmes`}
              {wonPrize.type === "discount_percent" && `${wonPrize.value}% de desconto`}
              {wonPrize.type === "discount_fixed" && `R$ ${(wonPrize.value / 100).toFixed(2)} de desconto`}
              {wonPrize.type === "free_service" && "Serviço grátis"}
              {wonPrize.type === "yearly_service" && "1 ano de serviço grátis"}
            </p>
          </motion.div>
        )}

        {/* Client name */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-body text-[24px] text-brand-text-muted"
        >
          Parabéns, {client?.name}!
        </motion.p>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7, ease: "easeOut" as const }}
          className="w-full max-w-[600px]"
        >
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              reset();
            }}
            className="w-full flex items-center justify-center min-h-[100px] rounded-[22px] text-[30px] font-semibold font-body text-white active:scale-[0.98] transition-transform ring-1 ring-white/20"
            style={{
              background: "linear-gradient(to right, #C2185B, #D94B8C)",
            }}
          >
            Voltar ao Início
          </button>
        </motion.div>
      </div>
    </div>
  );
}
