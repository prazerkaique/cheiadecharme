"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TimeoutWarningModalProps {
  secondsRemaining: number;
  onContinue: () => void;
  onEnd: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// Total seconds the warning is shown — used to compute arc circumference ratio.
// The parent is responsible for the actual countdown; this component is purely
// presentational and receives `secondsRemaining` as a prop.
const TOTAL_SECONDS = 30;

// SVG circle geometry
const CIRCLE_SIZE = 120;
const RADIUS = 48;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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
// CountdownCircle — SVG arc that drains as time runs out
// ---------------------------------------------------------------------------

interface CountdownCircleProps {
  secondsRemaining: number;
}

function CountdownCircle({ secondsRemaining }: CountdownCircleProps) {
  const clampedSeconds = Math.max(0, Math.min(secondsRemaining, TOTAL_SECONDS));
  const progress = clampedSeconds / TOTAL_SECONDS;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
      aria-hidden="true"
    >
      {/* SVG circle track + arc */}
      <svg
        width={CIRCLE_SIZE}
        height={CIRCLE_SIZE}
        viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
        style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
      >
        <defs>
          <linearGradient id="countdown-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C2185B" />
            <stop offset="100%" stopColor="#D94B8C" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(249,209,226,0.40)"
          strokeWidth={8}
        />

        {/* Progress arc */}
        <circle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="url(#countdown-gradient)"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.9s linear" }}
        />
      </svg>

      {/* Numeric value in center */}
      <span
        className="relative font-body font-bold text-brand-text tabular-nums"
        style={{ fontSize: "52px", lineHeight: 1 }}
      >
        {clampedSeconds}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TimeoutWarningModal({
  secondsRemaining,
  onContinue,
  onEnd,
}: TimeoutWarningModalProps) {
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
        aria-label="Aviso de inatividade"
      >
        <motion.div
          className="glass-strong w-full flex flex-col items-center gap-10 mx-6"
          style={{
            maxWidth: "680px",
            borderRadius: "32px",
            padding: "60px",
          }}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* ---------------------------------------------------------------- */}
          {/* Countdown circle                                                  */}
          {/* ---------------------------------------------------------------- */}
          <CountdownCircle secondsRemaining={secondsRemaining} />

          {/* ---------------------------------------------------------------- */}
          {/* Heading                                                           */}
          {/* ---------------------------------------------------------------- */}
          <h2
            className="font-display text-brand-text text-center"
            style={{ fontSize: "48px", lineHeight: 1.15, letterSpacing: "-0.01em" }}
          >
            Você ainda está aí?
          </h2>

          {/* ---------------------------------------------------------------- */}
          {/* Action buttons                                                    */}
          {/* ---------------------------------------------------------------- */}
          <div
            className="w-full flex flex-col"
            style={{ gap: "32px" }}
          >
            {/* Continuar — primary CTA */}
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                onContinue();
              }}
              className="w-full flex items-center justify-center glow-cta ring-1 ring-white/20 text-white font-body font-semibold tracking-wide active:scale-[0.98] transition-all duration-150"
              style={{
                minHeight: "120px",
                borderRadius: "22px",
                fontSize: "34px",
                background: "linear-gradient(to right, #C2185B, #D94B8C)",
              }}
            >
              Continuar
            </button>

            {/* Encerrar — secondary glass */}
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                onEnd();
              }}
              className="w-full flex items-center justify-center glass-strong border border-brand-border text-brand-text font-body font-medium active:scale-[0.98] transition-all duration-150"
              style={{
                minHeight: "90px",
                borderRadius: "22px",
                fontSize: "26px",
              }}
            >
              Encerrar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
