"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/game-store";
import { selectWeightedPrize } from "@/lib/spin-logic";

export default function ChooseGameScreen() {
  const setStep = useGameStore((s) => s.setStep);
  const setGameType = useGameStore((s) => s.setGameType);
  const setWonPrize = useGameStore((s) => s.setWonPrize);
  const config = useGameStore((s) => s.config);

  function handleChooseRoulette() {
    setGameType("roulette");
    setStep("spinning");
  }

  function handleChooseScratch() {
    const prize = selectWeightedPrize(config.scratchPrizes);
    setGameType("scratch");
    setWonPrize(prize);
    setStep("scratching");
  }

  return (
    <div className="flex flex-col items-center w-full h-screen gradient-mesh overflow-hidden">
      {/* Header */}
      <div className="w-full px-[60px] pt-12 pb-6 flex items-center justify-between">
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            setStep("payment");
          }}
          className="glass flex items-center justify-center min-h-[64px] px-8 rounded-full border border-glass-border font-body font-medium text-[24px] text-brand-text-muted active:scale-[0.98] transition-transform"
        >
          ← Voltar
        </button>
        <h2 className="font-display text-[42px] font-bold text-brand-text">
          Escolha seu Jogo
        </h2>
        <div style={{ width: 120 }} />
      </div>

      {/* Content */}
      <div className="flex-1 w-full px-[60px] flex flex-col items-center justify-center gap-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" as const }}
          className="font-body text-[28px] text-brand-text-muted text-center"
        >
          Pagamento confirmado! Escolha como quer jogar:
        </motion.p>

        <div className="w-full max-w-[720px] flex flex-col gap-8">
          {/* Roulette option */}
          <motion.button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              handleChooseRoulette();
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" as const }}
            className="w-full glass-strong flex items-center gap-8 min-h-[160px] px-10 rounded-[28px] border border-white/60 active:scale-[0.98] transition-all"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <div
              className="flex items-center justify-center w-24 h-24 rounded-full shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(194,24,91,0.15) 0%, rgba(217,75,140,0.10) 100%)",
              }}
            >
              <span className="text-[48px]">🎡</span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <span className="font-display text-[34px] font-bold text-brand-text">
                Roleta da Sorte
              </span>
              <span className="font-body text-[22px] text-brand-text-muted text-left">
                Gire a roleta e ganhe prêmios incríveis!
              </span>
            </div>
          </motion.button>

          {/* Scratch card option */}
          <motion.button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              handleChooseScratch();
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" as const }}
            className="w-full flex items-center gap-8 min-h-[160px] px-10 rounded-[28px] text-white active:scale-[0.98] transition-all ring-1 ring-white/20"
            style={{
              background: "linear-gradient(to right, #C2185B, #D94B8C)",
              boxShadow:
                "0 0 20px rgba(194,24,91,0.30), 0 4px 16px rgba(194,24,91,0.20)",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <div className="flex items-center justify-center w-24 h-24 rounded-full shrink-0 bg-white/15">
              <span className="text-[48px]">🎰</span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <span className="font-display text-[34px] font-bold">
                Raspadinha da Sorte
              </span>
              <span className="font-body text-[22px] text-white/70 text-left">
                Raspe e descubra seu prêmio na hora!
              </span>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
