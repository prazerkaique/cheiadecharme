"use client";

import { motion } from "framer-motion";
import { Coins, QrCode } from "lucide-react";
import { useGameStore } from "@/store/game-store";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatCharmes(charmes: number): string {
  return charmes.toLocaleString("pt-BR");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PaymentScreen() {
  const client = useGameStore((s) => s.client);
  const config = useGameStore((s) => s.config);
  const setStep = useGameStore((s) => s.setStep);
  const deductCharmes = useGameStore((s) => s.deductCharmes);
  const reset = useGameStore((s) => s.reset);

  const costInCharmes = config.spin_cost_cents / 100;
  const hasEnoughCharmes =
    (client?.balance_charmes ?? 0) >= costInCharmes;

  function handlePayWithCharmes() {
    if (!hasEnoughCharmes) return;
    deductCharmes(costInCharmes);
    setStep("choose_game");
  }

  function handlePayWithPix() {
    // In a real implementation, this would generate a PIX QR code
    // For now, we simulate instant payment
    setStep("choose_game");
  }

  return (
    <div className="flex flex-col items-center w-full h-screen gradient-mesh overflow-hidden">
      {/* Header */}
      <div className="w-full px-[60px] pt-12 pb-6 flex items-center justify-between">
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            setStep("identify");
          }}
          className="glass flex items-center justify-center min-h-[64px] px-8 rounded-full border border-glass-border font-body font-medium text-[24px] text-brand-text-muted active:scale-[0.98] transition-transform"
        >
          ← Voltar
        </button>
        <h2 className="font-display text-[42px] font-bold text-brand-text">
          Pagamento
        </h2>
        <div style={{ width: 120 }} />
      </div>

      {/* Content */}
      <div className="flex-1 w-full px-[60px] flex flex-col items-center justify-center gap-12">
        {/* Client greeting */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" as const }}
          className="text-center"
        >
          <p className="font-body text-[28px] text-brand-text-muted">
            Olá, <span className="font-semibold text-brand-text">{client?.name}</span>!
          </p>
          <p className="font-body text-[24px] text-brand-text-muted mt-2">
            Saldo: <span className="font-semibold">{formatCharmes(client?.balance_charmes ?? 0)} Charmes</span>
          </p>
        </motion.div>

        {/* Cost display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" as const }}
          className="glass-strong rounded-[28px] p-10 flex flex-col items-center gap-4"
        >
          <span className="font-body text-[26px] text-brand-text-muted">
            Valor da jogada
          </span>
          <span className="font-display text-[64px] font-bold text-brand-text">
            {formatCurrency(config.spin_cost_cents)}
          </span>
        </motion.div>

        {/* Payment options */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" as const }}
          className="w-full max-w-[720px] flex flex-col gap-6"
        >
          {/* Pay with Charmes */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              handlePayWithCharmes();
            }}
            disabled={!hasEnoughCharmes}
            className="w-full glass-strong flex items-center gap-6 min-h-[120px] px-10 rounded-[22px] border border-white/60 active:scale-[0.98] transition-all disabled:opacity-40"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <div
              className="flex items-center justify-center w-20 h-20 rounded-full shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.10) 100%)",
              }}
            >
              <Coins size={40} className="text-gold" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="font-body text-[30px] font-semibold text-brand-text">
                Pagar com Charmes
              </span>
              <span className="font-body text-[22px] text-brand-text-muted">
                {hasEnoughCharmes
                  ? `${costInCharmes} Charmes serão descontados`
                  : `Saldo insuficiente (precisa de ${costInCharmes})`}
              </span>
            </div>
          </button>

          {/* Pay with Pix */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              handlePayWithPix();
            }}
            className="w-full flex items-center gap-6 min-h-[120px] px-10 rounded-[22px] text-white active:scale-[0.98] transition-all ring-1 ring-white/20"
            style={{
              background: "linear-gradient(to right, #C2185B, #D94B8C)",
              boxShadow:
                "0 0 20px rgba(194,24,91,0.30), 0 4px 16px rgba(194,24,91,0.20)",
            }}
          >
            <div className="flex items-center justify-center w-20 h-20 rounded-full shrink-0 bg-white/15">
              <QrCode size={40} className="text-white" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="font-body text-[30px] font-semibold">
                Pagar com Pix
              </span>
              <span className="font-body text-[22px] text-white/70">
                {formatCurrency(config.spin_cost_cents)} via QR Code
              </span>
            </div>
          </button>
        </motion.div>

        {/* Cancel */}
        <motion.button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            reset();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-body text-[24px] text-brand-text-muted underline underline-offset-4"
        >
          Cancelar
        </motion.button>
      </div>
    </div>
  );
}
