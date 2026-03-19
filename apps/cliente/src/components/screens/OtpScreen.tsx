"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { useClientStore } from "@/store/client-store";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const ease = [0.22, 1, 0.36, 1] as const;

function maskPhone(ph: string): string {
  // "(44) 99760-7545" → "(44) 9****-7545"
  const digits = ph.replace(/\D/g, "");
  if (digits.length < 10) return ph;
  const ddd = digits.slice(0, 2);
  const last4 = digits.slice(-4);
  const first = digits.slice(2, 3);
  return `(${ddd}) ${first}****-${last4}`;
}

function maskEmail(em: string): string {
  // "luana@email.com" → "l***@email.com"
  const [local, domain] = em.split("@");
  if (!local || !domain) return em;
  return `${local[0]}***@${domain}`;
}

export function OtpScreen() {
  const loginMethod = useClientStore((s) => s.loginMethod);
  const phone = useClientStore((s) => s.phone);
  const email = useClientStore((s) => s.email);
  const otpCode = useClientStore((s) => s.otpCode);
  const setOtpCode = useClientStore((s) => s.setOtpCode);
  const verifyOtp = useClientStore((s) => s.verifyOtp);
  const sendOtp = useClientStore((s) => s.sendOtp);
  const navigate = useClientStore((s) => s.navigate);
  const authLoading = useClientStore((s) => s.authLoading);
  const authError = useClientStore((s) => s.authError);

  const otpTarget = loginMethod === "email" ? maskEmail(email) : maskPhone(phone);

  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const digits = otpCode.padEnd(6, " ").split("");

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newCode = otpCode.split("");
    newCode[index] = digit;
    const code = newCode.join("").trim();
    setOtpCode(code);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setCountdown(60);
    sendOtp();
  };

  return (
    <div className="min-h-dvh flex flex-col px-6 pt-8">
      <button
        onPointerDown={(e) => { e.preventDefault(); navigate("login"); }}
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary/30 transition-colors mb-6"
      >
        <ChevronLeft className="w-6 h-6 text-brand-text" />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="flex-1 flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-cta flex items-center justify-center mb-6 glow-primary">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-xl font-display font-bold text-brand-text mb-2">
          Verificacao
        </h2>
        <p className="text-brand-text-muted text-center mb-8">
          Codigo enviado para<br />
          <span className="font-semibold text-brand-text">{otpTarget}</span>
        </p>

        {/* OTP Inputs */}
        <div className="flex gap-3 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digits[i]?.trim() ?? ""}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={authLoading}
              className="w-12 h-14 rounded-xl bg-surface border-2 border-brand-border text-center text-xl font-bold text-brand-text focus:outline-none focus:border-cta focus:ring-2 focus:ring-cta/20 transition-all"
            />
          ))}
        </div>

        {authError && (
          <p className="text-error text-sm mb-4">{authError}</p>
        )}

        <button
          onPointerDown={(e) => { e.preventDefault(); verifyOtp(); }}
          disabled={authLoading || otpCode.length < 6}
          className="w-full max-w-xs py-4 rounded-xl bg-gradient-to-r from-cta to-primary text-white font-display font-semibold text-lg disabled:opacity-50 transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {authLoading ? <LoadingSpinner size={24} /> : "Verificar"}
        </button>

        <button
          onPointerDown={(e) => { e.preventDefault(); if (countdown <= 0) handleResend(); }}
          disabled={countdown > 0}
          className="mt-6 text-sm text-brand-text-muted disabled:opacity-50"
        >
          {countdown > 0 ? `Reenviar em ${countdown}s` : "Reenviar codigo"}
        </button>
      </motion.div>
    </div>
  );
}
