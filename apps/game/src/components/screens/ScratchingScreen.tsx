"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/game-store";
import ScratchCard from "@/components/scratch/ScratchCard";

export default function ScratchingScreen() {
  const wonPrize = useGameStore((s) => s.wonPrize);
  const setStep = useGameStore((s) => s.setStep);
  const setIsScratching = useGameStore((s) => s.setIsScratching);

  const handleReveal = useCallback(() => {
    setIsScratching(false);
    setTimeout(() => {
      setStep("prize");
    }, 1500);
  }, [setStep, setIsScratching]);

  if (!wonPrize) return null;

  return (
    <div className="flex flex-col items-center w-full h-screen gradient-mesh overflow-hidden">
      {/* Header */}
      <div className="w-full px-[60px] pt-12 pb-6 flex items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
          className="font-display text-[56px] font-bold text-brand-text"
        >
          Raspe e Descubra!
        </motion.h1>
      </div>

      {/* Scratch card */}
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-8 px-[60px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <ScratchCard prize={wonPrize} onReveal={handleReveal} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-body text-[24px] text-brand-text-muted"
        >
          Use o dedo para raspar a área prateada
        </motion.p>
      </div>
    </div>
  );
}
