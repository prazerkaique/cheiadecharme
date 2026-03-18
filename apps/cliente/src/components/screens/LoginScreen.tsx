"use client";

import { motion } from "framer-motion";
import { Phone, Sparkles } from "lucide-react";
import { useClientStore } from "@/store/client-store";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const ease = [0.22, 1, 0.36, 1] as const;

export function LoginScreen() {
  const phone = useClientStore((s) => s.phone);
  const setPhone = useClientStore((s) => s.setPhone);
  const sendOtp = useClientStore((s) => s.sendOtp);
  const authLoading = useClientStore((s) => s.authLoading);
  const authError = useClientStore((s) => s.authError);

  const formatInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-cta flex items-center justify-center mx-auto mb-4 glow-primary"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-2xl font-display font-bold text-brand-text">
            Cheia de Charme
          </h1>
          <p className="text-brand-text-muted mt-1">
            Entre com seu telefone
          </p>
        </div>

        {/* Phone input */}
        <div className="glass-strong rounded-2xl p-6 space-y-4">
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-muted" />
            <input
              type="tel"
              inputMode="tel"
              placeholder="(21) 99000-0001"
              value={phone}
              onChange={(e) => setPhone(formatInput(e.target.value))}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-background border border-brand-border text-brand-text text-lg font-medium placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-cta/30 focus:border-cta transition-all"
              disabled={authLoading}
            />
          </div>

          {authError && (
            <p className="text-error text-sm text-center">{authError}</p>
          )}

          <button
            onPointerDown={(e) => { e.preventDefault(); sendOtp(); }}
            disabled={authLoading || phone.replace(/\D/g, "").length < 10}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cta to-primary text-white font-display font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {authLoading ? (
              <LoadingSpinner size={24} />
            ) : (
              "Enviar codigo"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
