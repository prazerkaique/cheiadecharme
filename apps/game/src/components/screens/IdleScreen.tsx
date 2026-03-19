"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
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

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function IdleScreen() {
  const setStep = useGameStore((s) => s.setStep);
  const config = useGameStore((s) => s.config);
  const loadConfig = useGameStore((s) => s.loadConfig);
  const [currentTime, setCurrentTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    const id = setInterval(() => setCurrentTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full h-screen overflow-hidden game-bg-animated"
      style={{
        background:
          "linear-gradient(160deg, #4A0D2E 0%, #6B1A3A 30%, #4A0D2E 60%, #2D0A1E 100%)",
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        setStep("identify");
      }}
    >
      {/* Decorative particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 4 + Math.random() * 6,
              height: 4 + Math.random() * 6,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(${
                i % 3 === 0
                  ? "245,158,11"
                  : i % 3 === 1
                    ? "217,75,140"
                    : "139,92,246"
              }, ${0.3 + Math.random() * 0.4})`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut" as const,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full px-8">
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-12 w-full max-w-[920px]"
        >
          {/* Logo */}
          <motion.div
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" as const }}
          >
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-[-20%] rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,182,217,0.7) 0%, rgba(255,182,217,0) 70%)",
                  filter: "blur(30px)",
                }}
              />
              <Image
                src="/logo.png"
                alt="Cheia de Charme"
                width={240}
                height={240}
                priority
                className="relative drop-shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" as const }}
          >
            <h1
              className="font-display text-[64px] text-white text-center leading-[1.1] font-bold drop-shadow-lg"
              style={{ letterSpacing: "-0.02em" }}
            >
              Cheia de Sorte
            </h1>
            <p
              className="font-body text-[28px] text-center"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Jogue e ganhe prêmios incríveis!
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="relative w-full flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" as const }}
          >
            {/* Glow */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 bottom-0 rounded-[20px] blur-2xl opacity-50 pointer-events-none"
              style={{
                background: "linear-gradient(to right, #C2185B, #D94B8C)",
              }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
            />

            <motion.div
              className="relative w-full"
              animate={{ scale: [1, 1.015, 1] }}
              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
            >
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  setStep("identify");
                }}
                className="w-full flex items-center justify-center min-h-[120px] px-10 rounded-[24px] text-[34px] font-semibold font-body tracking-wide text-white active:scale-[0.98] transition-transform duration-100 ring-1 ring-white/30"
                style={{
                  background: "linear-gradient(to right, #C2185B, #D94B8C)",
                  boxShadow:
                    "0 0 30px rgba(194,24,91,0.45), 0 8px 32px rgba(194,24,91,0.30)",
                }}
                aria-label="Toque para jogar"
              >
                Toque para Jogar — {formatCurrency(config.spin_cost_cents)}
              </button>
            </motion.div>

            <p
              className="relative z-10 font-body text-[24px] text-center"
              style={{ color: "rgba(255,255,255,0.50)" }}
            >
              Descontos&nbsp;&nbsp;•&nbsp;&nbsp;Serviços Grátis&nbsp;&nbsp;•&nbsp;&nbsp;Charmes
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="relative z-10 w-full flex items-center justify-between px-10 py-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
      >
        <span className="font-body text-[22px]" style={{ color: "rgba(255,255,255,0.45)" }}>
          Cheia de Charme — Cheia de Sorte
        </span>
        <span
          className="font-body text-[22px] tabular-nums"
          style={{ color: "rgba(255,255,255,0.45)" }}
          aria-live="polite"
        >
          {currentTime}
        </span>
      </motion.footer>
    </div>
  );
}
