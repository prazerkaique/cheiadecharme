"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Printer } from "@phosphor-icons/react";
import { useKioskStore } from "@/store/kiosk-store";
import QRCodeDisplay from "@/components/kiosk/QRCodeDisplay";
import ScreenLayout from "@/components/kiosk/ScreenLayout";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COUNTDOWN_SECONDS = 15;

const STEP_LABELS = ["Identificação", "Serviço", "Confirmação", "Concluído"];

// ---------------------------------------------------------------------------
// Staggered fade-up helper
// ---------------------------------------------------------------------------

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 22, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const, delay },
  } as const;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DoneScreen() {
  const appointment = useKioskStore((s) => s.appointment);
  const reset = useKioskStore((s) => s.reset);

  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

  // Auto-return countdown
  useEffect(() => {
    if (countdown <= 0) {
      reset();
      return;
    }
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [countdown, reset]);

  if (!appointment) return null;

  const estimatedWait = appointment.queue_position * 15;
  const progressPercent = (countdown / COUNTDOWN_SECONDS) * 100;

  return (
    <ScreenLayout
      title="Obrigado!"
      currentStep={3}
      totalSteps={4}
      stepLabels={STEP_LABELS}
      primaryAction={{
        label: "Voltar ao início",
        onClick: reset,
      }}
    >
      {/* Scroll container for all body content */}
      <div className="flex flex-col items-center overflow-y-auto scrollbar-branded h-full gap-7 pb-4">

        {/* ---------------------------------------------------------------- */}
        {/* Success icon in gradient halo circle                              */}
        {/* ---------------------------------------------------------------- */}
        <motion.div {...fadeUp(0)} className="flex items-center justify-center">
          {/* Outer glow ring */}
          <div
            className="absolute w-40 h-40 rounded-full blur-2xl opacity-40"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.4), rgba(194,24,91,0.2))" }}
            aria-hidden="true"
          />
          {/* Gradient halo */}
          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.20) 0%, rgba(194,24,91,0.10) 100%)",
              border: "1.5px solid rgba(16,185,129,0.25)",
              boxShadow: "0 0 32px rgba(16,185,129,0.15), 0 0 80px rgba(16,185,129,0.08)",
            }}
          >
            <CheckCircle
              size={52}
              className="text-success"
              weight="light"
              aria-hidden="true"
            />
          </div>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Printing coupon animation                                         */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          {...fadeUp(0.05)}
          className="w-full flex items-center justify-center gap-4 px-6 py-5 rounded-[20px] glass-strong border border-cta/20"
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" as const }}
          >
            <Printer size={28} className="text-cta shrink-0" weight="light" />
          </motion.div>
          <div className="flex flex-col">
            <motion.span
              className="text-[24px] font-body font-semibold text-brand-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Aguarde a impressão do cupom
            </motion.span>
            <motion.div
              className="h-[3px] rounded-full mt-1.5 origin-left"
              style={{ background: "linear-gradient(to right, #C2185B, #D94B8C)" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
            />
          </div>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Ticket number — massive gradient text                             */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          {...fadeUp(0.07)}
          className="flex flex-col items-center gap-1"
        >
          <span
            className="font-body font-bold leading-none bg-clip-text text-transparent"
            style={{
              fontSize: "80px",
              backgroundImage: "linear-gradient(to right, #C2185B, #D94B8C)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
            }}
            aria-label={`Número de atendimento ${appointment.ticket_number}`}
          >
            {appointment.ticket_number}
          </span>
          <span className="text-[24px] font-body text-brand-text-muted text-center mt-1">
            Seu número de atendimento
          </span>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* QR Code in glass card                                             */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          {...fadeUp(0.13)}
          className="glass rounded-[24px] p-6 flex flex-col items-center gap-3 w-full max-w-xs self-center"
        >
          <QRCodeDisplay value={appointment.qr_code} size={220} />
          <span className="text-[22px] font-body text-brand-text-muted text-center">
            Apresente na recepção
          </span>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Queue position card                                               */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          {...fadeUp(0.19)}
          className="glass-strong rounded-[24px] px-8 py-7 w-full flex flex-col items-center gap-4"
        >
          {/* Position line */}
          <p className="text-[24px] font-body font-semibold text-brand-text text-center leading-snug">
            Você é o{" "}
            <span
              className="font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(to right, #C2185B, #D94B8C)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {appointment.queue_position}º
            </span>
            {" "}da fila
          </p>

          {/* Thin gradient divider */}
          <div
            aria-hidden="true"
            className="w-16 h-px"
            style={{
              background: "linear-gradient(to right, transparent, rgba(217,75,140,0.35), transparent)",
            }}
          />

          {/* Wait time */}
          <p className="text-[20px] font-body text-brand-text-muted text-center">
            <span className="font-semibold text-brand-text">~{estimatedWait} minutos</span> de espera
          </p>

          {/* Panel instruction */}
          <p className="text-[22px] font-body text-brand-text-muted text-center leading-relaxed">
            Aguarde ser chamado(a) pelo painel da TV
          </p>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Countdown text + progress bar (above the CTA in the footer)      */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          {...fadeUp(0.25)}
          className="w-full flex flex-col items-center gap-4"
        >
          {/* Countdown text */}
          <p
            className="text-[20px] font-body text-brand-text-muted text-center tabular-nums"
            aria-live="polite"
            aria-label={`Voltando ao início em ${countdown} segundos`}
          >
            Voltando ao início em{" "}
            <span className="font-bold text-brand-text">{countdown}s</span>
          </p>

          {/* Shrinking gradient progress bar */}
          <div
            className="w-full max-w-sm h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(249,209,226,0.5)" }}
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full transition-all duration-1000 ease-linear"
              style={{
                width: `${progressPercent}%`,
                background: "linear-gradient(to right, #C2185B, #D94B8C)",
              }}
            />
          </div>
        </motion.div>

      </div>
    </ScreenLayout>
  );
}
