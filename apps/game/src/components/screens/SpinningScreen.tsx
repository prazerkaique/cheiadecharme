"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import SpinWheel from "@/components/wheel/SpinWheel";
import { useGameStore } from "@/store/game-store";
import { selectWeightedPrize, calculateFinalAngle } from "@/lib/spin-logic";
import { registerSpin } from "@/lib/queries/game";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SpinningScreen() {
  const config = useGameStore((s) => s.config);
  const client = useGameStore((s) => s.client);
  const setStep = useGameStore((s) => s.setStep);
  const setWonPrize = useGameStore((s) => s.setWonPrize);
  const isSpinning = useGameStore((s) => s.isSpinning);
  const setIsSpinning = useGameStore((s) => s.setIsSpinning);

  const [targetAngle, setTargetAngle] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);

  function handleSpin() {
    if (isSpinning || hasSpun) return;

    const prize = selectWeightedPrize(config.prizes);
    const prizeIndex = config.prizes.findIndex((p) => p.id === prize.id);
    const angle = calculateFinalAngle(prizeIndex, config.prizes.length);

    setWonPrize(prize);
    setTargetAngle(angle);
    setIsSpinning(true);
    setHasSpun(true);

    // Register the spin
    if (client) {
      registerSpin(client.id, prize.id);
    }
  }

  const handleSpinEnd = useCallback(() => {
    setIsSpinning(false);
    // Delay before showing prize screen
    setTimeout(() => {
      setStep("prize");
    }, 1000);
  }, [setIsSpinning, setStep]);

  return (
    <div className="flex flex-col items-center w-full h-screen overflow-hidden gradient-mesh">
      {/* Wheel container */}
      <div className="flex-1 w-full flex flex-col items-center justify-center">
        {/* Title — big, pink */}
        <h2
          className="font-display font-bold text-center"
          style={{ fontSize: "56px", color: "#C2185B", marginBottom: "32px" }}
        >
          {isSpinning ? "Girando..." : hasSpun ? "Resultado!" : "Gire a Roleta!"}
        </h2>

        {/* Wheel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
        >
          <SpinWheel
            prizes={config.prizes}
            spinning={isSpinning}
            targetAngle={targetAngle}
            onSpinEnd={handleSpinEnd}
            logoUrl={config.logo_url}
          />
        </motion.div>

        {/* Spin button — below wheel with spacing */}
        {!hasSpun && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" as const }}
            className="w-full max-w-[600px] px-[60px]"
            style={{ marginTop: "53px" }}
          >
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
            >
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleSpin();
                }}
                className="w-full flex items-center justify-center min-h-[120px] rounded-[24px] text-[40px] font-bold font-display text-white active:scale-[0.98] transition-transform ring-1 ring-white/20"
                style={{
                  background: "linear-gradient(to right, #C2185B, #D94B8C)",
                  boxShadow:
                    "0 0 30px rgba(194,24,91,0.45), 0 8px 32px rgba(194,24,91,0.30)",
                }}
              >
                GIRAR!
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Spinning feedback */}
        {isSpinning && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="font-body text-[26px] text-brand-text-muted"
          >
            Boa sorte! 🍀
          </motion.p>
        )}
      </div>
    </div>
  );
}
