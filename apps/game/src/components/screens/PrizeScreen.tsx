"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Gift, Sparkles, RotateCcw, Frown, Crown } from "lucide-react";
import { useGameStore } from "@/store/game-store";
import { claimPrize } from "@/lib/queries/game";
import ClaimConfirmModal from "@/components/kiosk/ClaimConfirmModal";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function maskCpf(cpf: string | null): string {
  if (!cpf) return "***.***.***-**";
  const digits = cpf.replace(/\D/g, "");
  if (digits.length < 11) return "***.***.***-**";
  return `***.***. ${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

// ---------------------------------------------------------------------------
// Confetti
// ---------------------------------------------------------------------------

const CONFETTI_COLORS = [
  "#D94B8C",
  "#F59E0B",
  "#8B5CF6",
  "#10B981",
  "#E87AAF",
  "#FBBF24",
  "#C2185B",
  "#7C3AED",
];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        color:
          CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 8 + Math.random() * 8,
        rotation: Math.random() * 360,
      })),
    []
  );

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-20"
      aria-hidden="true"
    >
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Prize messages
// ---------------------------------------------------------------------------

function getPrizeMessage(prize: { type: string; label: string; value: number }) {
  switch (prize.type) {
    case "discount_percent":
      return {
        title: `${prize.value}% de Desconto!`,
        subtitle: "Use na sua próxima visita",
        icon: <Sparkles size={64} className="text-gold" />,
      };
    case "discount_fixed":
      return {
        title: `R$ ${(prize.value / 100).toFixed(2)} de Desconto!`,
        subtitle: "Use na sua próxima visita",
        icon: <Sparkles size={64} className="text-gold" />,
      };
    case "free_service":
      return {
        title: `${prize.label}!`,
        subtitle: "Serviço grátis para você",
        icon: <Gift size={64} className="text-success" />,
      };
    case "charmes":
      return {
        title: `+${prize.value} Charmes!`,
        subtitle: "Adicionados ao seu saldo",
        icon: <Sparkles size={64} className="text-purple" />,
      };
    case "try_again":
      return {
        title: "Tente Novamente!",
        subtitle: "Quem sabe na próxima?",
        icon: <RotateCcw size={64} className="text-brand-text-muted" />,
      };
    case "nothing":
      return {
        title: "Não foi dessa vez!",
        subtitle: "Tente novamente na próxima!",
        icon: <Frown size={64} className="text-brand-text-muted" />,
      };
    case "yearly_service":
      return {
        title: "1 ANO DE CORTE GRÁTIS!",
        subtitle: "Você ganhou o prêmio máximo!",
        icon: <Crown size={64} className="text-gold" />,
      };
    default:
      return {
        title: prize.label,
        subtitle: "",
        icon: <Gift size={64} className="text-primary" />,
      };
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const AUTO_RESET_MS = 15_000;

export default function PrizeScreen() {
  const wonPrize = useGameStore((s) => s.wonPrize);
  const client = useGameStore((s) => s.client);
  const addCharmes = useGameStore((s) => s.addCharmes);
  const reset = useGameStore((s) => s.reset);
  const setStep = useGameStore((s) => s.setStep);

  const [showConfirm, setShowConfirm] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isTryAgain = wonPrize?.type === "try_again" || wonPrize?.type === "nothing";
  const prizeInfo = wonPrize
    ? getPrizeMessage(wonPrize)
    : { title: "", subtitle: "", icon: null };

  // Add charmes on mount (instant visual feedback)
  useEffect(() => {
    if (!wonPrize || !client) return;
    if (wonPrize.type === "charmes") {
      addCharmes(wonPrize.value);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-reset timer — paused when confirm modal is open
  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(reset, AUTO_RESET_MS);
  }, [reset]);

  useEffect(() => {
    if (showConfirm) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    } else {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showConfirm, startTimer]);

  async function handleConfirm() {
    if (!wonPrize || !client) return;
    try {
      await claimPrize(client.id, wonPrize);
      setStep("claimed");
    } catch (err) {
      console.error("[PrizeScreen] claimPrize failed:", err);
      // Still transition — the prize was already won, just log the persistence error
      setStep("claimed");
    }
  }

  function handleCancel() {
    reset();
  }

  return (
    <div className="relative flex flex-col items-center w-full h-screen gradient-mesh overflow-hidden">
      {/* Confetti for wins */}
      {!isTryAgain && <Confetti />}

      {/* Content */}
      <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-center gap-10 px-[60px]">
        {/* Prize icon with glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative"
        >
          {!isTryAgain && (
            <div
              aria-hidden="true"
              className="absolute inset-[-50%] rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${wonPrize?.color ?? "#D94B8C"}44 0%, transparent 70%)`,
                filter: "blur(40px)",
              }}
            />
          )}
          <div
            className="relative flex items-center justify-center w-40 h-40 rounded-full"
            style={{
              background: isTryAgain
                ? "rgba(156,163,175,0.15)"
                : `linear-gradient(135deg, ${wonPrize?.color ?? "#D94B8C"}22, ${wonPrize?.color ?? "#D94B8C"}11)`,
              border: `2px solid ${isTryAgain ? "rgba(156,163,175,0.3)" : (wonPrize?.color ?? "#D94B8C") + "44"}`,
            }}
          >
            {prizeInfo.icon}
          </div>
        </motion.div>

        {/* Prize text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" as const }}
          className="flex flex-col items-center gap-4"
        >
          <h1 className="font-display text-[56px] font-bold text-brand-text text-center leading-tight">
            {prizeInfo.title}
          </h1>
          {prizeInfo.subtitle && (
            <p className="font-body text-[28px] text-brand-text-muted text-center">
              {prizeInfo.subtitle}
            </p>
          )}
        </motion.div>

        {/* Client name */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-body text-[24px] text-brand-text-muted"
        >
          Parabéns, {client?.name}!
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" as const }}
          className="w-full max-w-[600px] flex flex-col gap-5"
        >
          {isTryAgain ? (
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setStep("payment");
              }}
              className="w-full flex items-center justify-center min-h-[100px] rounded-[22px] text-[30px] font-semibold font-body text-white active:scale-[0.98] transition-transform ring-1 ring-white/20"
              style={{
                background: "linear-gradient(to right, #F59E0B, #D94B8C)",
                boxShadow:
                  "0 0 20px rgba(245,158,11,0.30), 0 4px 16px rgba(217,75,140,0.20)",
              }}
            >
              Jogar Novamente
            </button>
          ) : (
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setShowConfirm(true);
              }}
              className="w-full flex items-center justify-center min-h-[100px] rounded-[22px] text-[30px] font-semibold font-body text-white active:scale-[0.98] transition-transform ring-1 ring-white/20"
              style={{
                background: "linear-gradient(to right, #C2185B, #D94B8C)",
              }}
            >
              Resgatar Prêmio
            </button>
          )}

          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              reset();
            }}
            className="w-full flex items-center justify-center min-h-[80px] rounded-[22px] text-[24px] font-body text-brand-text-muted active:scale-[0.98] transition-transform"
          >
            Voltar ao Início
          </button>
        </motion.div>
      </div>

      {/* Claim confirmation modal */}
      {showConfirm && client && (
        <ClaimConfirmModal
          clientName={client.name}
          maskedCpf={maskCpf(client.cpf)}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
