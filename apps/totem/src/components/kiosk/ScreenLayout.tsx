"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import ProgressStepper from "@/components/kiosk/ProgressStepper";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PrimaryAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

interface SecondaryAction {
  label: string;
  onClick: () => void;
}

interface ScreenLayoutProps {
  title: string;
  subtitle?: string;
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  primaryAction?: PrimaryAction;
  secondaryAction?: SecondaryAction;
  backAction?: () => void;
  cancelAction?: () => void;
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatClock(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
  },
};

const bodyVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.18 },
  },
};

const footerVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.22 },
  },
};

// ---------------------------------------------------------------------------
// SpinnerIcon
// ---------------------------------------------------------------------------

function SpinnerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      className="w-7 h-7 animate-spin"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Clock — live HH:MM display
// ---------------------------------------------------------------------------

function Clock() {
  const [time, setTime] = useState<string>(() => formatClock(new Date()));

  useEffect(() => {
    const id = setInterval(() => {
      setTime(formatClock(new Date()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="font-body text-[24px] tabular-nums text-brand-text-muted select-none"
      aria-live="polite"
      aria-label={`Hora atual: ${time}`}
    >
      {time}
    </span>
  );
}

// ---------------------------------------------------------------------------
// NavPill — shared glass pill style for back/cancel buttons
// ---------------------------------------------------------------------------

interface NavPillProps {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  ariaLabel?: string;
}

function NavPill({ label, icon, onClick, ariaLabel }: NavPillProps) {
  return (
    <button
      type="button"
      onPointerDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      aria-label={ariaLabel ?? label}
      className={[
        "glass flex items-center gap-3",
        "min-h-[90px] px-7 rounded-full",
        "font-body text-[24px] font-medium text-brand-text-muted",
        "border border-glass-border select-none",
        "active:scale-[0.95] active:opacity-80 transition-all duration-100",
      ].join(" ")}
    >
      {icon !== undefined && (
        <span aria-hidden="true" className="text-[26px] leading-none">
          {icon}
        </span>
      )}
      <span>{label}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// ScreenLayout
// ---------------------------------------------------------------------------

export default function ScreenLayout({
  title,
  subtitle,
  currentStep,
  totalSteps,
  stepLabels,
  primaryAction,
  secondaryAction,
  backAction,
  cancelAction,
  children,
}: ScreenLayoutProps) {
  const hasFooterButtons =
    primaryAction !== undefined || secondaryAction !== undefined;

  // The right nav slot shows: cancelAction button > clock fallback
  const rightNavSlot =
    cancelAction !== undefined ? (
      <NavPill
        label="Cancelar"
        onClick={cancelAction}
        ariaLabel="Cancelar atendimento"
      />
    ) : (
      <Clock />
    );

  return (
    <div className="gradient-mesh relative flex flex-col w-full h-screen overflow-hidden">

      {/* ------------------------------------------------------------------ */}
      {/* HEADER — absolute zone 0–280px                                      */}
      {/* ------------------------------------------------------------------ */}
      <motion.header
        className="absolute top-0 left-0 right-0 z-20 flex flex-col px-[60px]"
        style={{ height: "280px" }}
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ---- Top navigation row: Back | Stepper | Cancel/Clock ---- */}
        <div className="flex items-center justify-between pt-8" style={{ minHeight: "90px" }}>

          {/* Left — back button or invisible spacer for centring */}
          <div style={{ minWidth: "200px" }}>
            {backAction !== undefined ? (
              <NavPill
                label="Voltar"
                icon="←"
                onClick={backAction}
                ariaLabel="Voltar"
              />
            ) : (
              <span
                className="invisible block min-h-[90px] px-7"
                aria-hidden="true"
              />
            )}
          </div>

          {/* Centre — progress stepper */}
          <div className="flex-1 flex items-center justify-center px-4">
            <ProgressStepper
              currentStep={currentStep}
              totalSteps={totalSteps}
              labels={stepLabels}
            />
          </div>

          {/* Right — cancel button or live clock */}
          <div
            className="flex items-center justify-end"
            style={{ minWidth: "200px" }}
          >
            {rightNavSlot}
          </div>
        </div>

        {/* ---- Title + subtitle ---- */}
        <motion.div
          className="flex flex-col gap-2 mt-auto pb-6"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <h1
            className="font-display text-[52px] text-brand-text leading-tight"
            style={{ letterSpacing: "-0.015em" }}
          >
            {title}
          </h1>

          {subtitle !== undefined && (
            <p className="font-body text-[30px] text-brand-text-muted leading-snug">
              {subtitle}
            </p>
          )}
        </motion.div>
      </motion.header>

      {/* ------------------------------------------------------------------ */}
      {/* BODY — absolute zone 280–1500px (or 280–bottom when no footer)      */}
      {/* overflow-hidden by default; individual screens opt into scroll       */}
      {/* ------------------------------------------------------------------ */}
      <motion.main
        className="absolute left-0 right-0 overflow-hidden px-[60px]"
        style={{
          top: "280px",
          bottom: hasFooterButtons ? "420px" : "60px",
        }}
        variants={bodyVariants}
        initial="hidden"
        animate="visible"
      >
        {children}
      </motion.main>

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER — absolute zone 1500–1920px (420px)                          */}
      {/* Rendered only when at least one action prop is provided              */}
      {/* ------------------------------------------------------------------ */}
      {hasFooterButtons && (
        <motion.footer
          className="absolute bottom-0 left-0 right-0 z-20 flex flex-col justify-end px-[60px] pb-14"
          style={{ height: "420px" }}
          variants={footerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Glass backing panel */}
          <div
            className="absolute inset-0 glass-strong"
            aria-hidden="true"
            style={{
              borderTop: "1.5px solid rgba(217,75,140,0.22)",
            }}
          />

          {/* Soft fade scrim at the top edge of the footer */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-16 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,245,249,0.0), rgba(255,255,255,0.08))",
            }}
          />

          {/* Gradient top-border line accent */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[2px] pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(194,24,91,0.30) 30%, rgba(217,75,140,0.40) 50%, rgba(194,24,91,0.30) 70%, transparent)",
            }}
          />

          {/* Button stack — gap matches --kiosk-button-gap: 32px */}
          <div className="relative flex flex-col gap-[32px]">

            {/* Primary CTA */}
            {primaryAction !== undefined && (
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  if (
                    primaryAction.disabled !== true &&
                    primaryAction.loading !== true
                  ) {
                    primaryAction.onClick();
                  }
                }}
                disabled={
                  primaryAction.disabled === true ||
                  primaryAction.loading === true
                }
                aria-disabled={
                  primaryAction.disabled === true ||
                  primaryAction.loading === true
                }
                className={[
                  "w-full flex items-center justify-center gap-4",
                  "min-h-[120px] px-10 rounded-[22px]",
                  "font-body text-[34px] font-semibold tracking-wide text-white",
                  "ring-1 ring-white/20",
                  "transition-all duration-150",
                  primaryAction.disabled === true
                    ? "opacity-40 cursor-not-allowed"
                    : primaryAction.loading === true
                    ? "opacity-80 cursor-not-allowed"
                    : "glow-cta active:scale-[0.98]",
                ].join(" ")}
                style={{
                  background:
                    primaryAction.disabled === true
                      ? "linear-gradient(to right, rgba(194,24,91,0.48), rgba(217,75,140,0.48))"
                      : "linear-gradient(to right, #C2185B, #D94B8C)",
                }}
              >
                {primaryAction.loading === true ? (
                  <>
                    <SpinnerIcon />
                    <span>{primaryAction.label}</span>
                  </>
                ) : (
                  primaryAction.label
                )}
              </button>
            )}

            {/* Secondary button */}
            {secondaryAction !== undefined && (
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  secondaryAction.onClick();
                }}
                className={[
                  "w-full flex items-center justify-center",
                  "min-h-[90px] px-10 rounded-[22px]",
                  "glass-strong border border-brand-border",
                  "font-body text-[26px] font-medium text-brand-text",
                  "active:scale-[0.98] active:opacity-80 transition-all duration-100",
                ].join(" ")}
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        </motion.footer>
      )}
    </div>
  );
}
