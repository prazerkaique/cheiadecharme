"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, CreditCard, Sparkles, ChevronLeft, Lock } from "lucide-react";
import { useClientStore } from "@/store/client-store";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { LoginMethod } from "@/types/client";

const ease = [0.22, 1, 0.36, 1] as const;

const METHODS: { key: LoginMethod; label: string; icon: typeof Phone; desc: string }[] = [
  { key: "phone", label: "Telefone", icon: Phone, desc: "Entre com seu telefone" },
  { key: "email", label: "Email", icon: Mail, desc: "Entre com seu email" },
  { key: "cpf", label: "CPF", icon: CreditCard, desc: "Entre com seu CPF" },
];

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function LoginScreen() {
  const loginMethod = useClientStore((s) => s.loginMethod);
  const setLoginMethod = useClientStore((s) => s.setLoginMethod);
  const phone = useClientStore((s) => s.phone);
  const setPhone = useClientStore((s) => s.setPhone);
  const email = useClientStore((s) => s.email);
  const setEmail = useClientStore((s) => s.setEmail);
  const cpf = useClientStore((s) => s.cpf);
  const setCpf = useClientStore((s) => s.setCpf);
  const password = useClientStore((s) => s.password);
  const setPassword = useClientStore((s) => s.setPassword);
  const login = useClientStore((s) => s.login);
  const authLoading = useClientStore((s) => s.authLoading);
  const authError = useClientStore((s) => s.authError);

  const isDisabled = () => {
    if (authLoading || !password) return true;
    if (loginMethod === "phone") return phone.replace(/\D/g, "").length < 10;
    if (loginMethod === "email") return !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (loginMethod === "cpf") return cpf.replace(/\D/g, "").length !== 11;
    return true;
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
            {loginMethod === null ? "Como deseja entrar?" : "Entre com seu " + (loginMethod === "phone" ? "telefone" : loginMethod === "email" ? "email" : "CPF")}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {loginMethod === null ? (
            /* ── Stage 1: Method selection ── */
            <motion.div
              key="methods"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease }}
              className="space-y-3"
            >
              {METHODS.map((m, i) => (
                <motion.button
                  key={m.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease, delay: i * 0.08 }}
                  onPointerDown={(e) => { e.preventDefault(); setLoginMethod(m.key); }}
                  className="w-full glass-strong rounded-2xl p-5 flex items-center gap-4 text-left hover:ring-2 hover:ring-cta/30 transition-all active:scale-[0.98]"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-cta/20 flex items-center justify-center shrink-0">
                    <m.icon className="w-6 h-6 text-cta" />
                  </div>
                  <div>
                    <span className="font-display font-semibold text-brand-text text-lg">{m.label}</span>
                    <p className="text-sm text-brand-text-muted">{m.desc}</p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            /* ── Stage 2: Input + password ── */
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease }}
            >
              <button
                onPointerDown={(e) => { e.preventDefault(); setLoginMethod(null); }}
                className="flex items-center gap-1 text-brand-text-muted text-sm mb-4 hover:text-brand-text transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar
              </button>

              <div className="glass-strong rounded-2xl p-6 space-y-4">
                {loginMethod === "phone" && (
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-muted" />
                    <input
                      type="tel"
                      inputMode="tel"
                      placeholder="(21) 99000-0001"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-background border border-brand-border text-brand-text text-lg font-medium placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-cta/30 focus:border-cta transition-all"
                      disabled={authLoading}
                      autoFocus
                    />
                  </div>
                )}

                {loginMethod === "email" && (
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-muted" />
                    <input
                      type="email"
                      inputMode="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-background border border-brand-border text-brand-text text-lg font-medium placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-cta/30 focus:border-cta transition-all"
                      disabled={authLoading}
                      autoFocus
                    />
                  </div>
                )}

                {loginMethod === "cpf" && (
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-muted" />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => setCpf(formatCpf(e.target.value))}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-background border border-brand-border text-brand-text text-lg font-medium placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-cta/30 focus:border-cta transition-all"
                      disabled={authLoading}
                      autoFocus
                    />
                  </div>
                )}

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-muted" />
                  <input
                    type="password"
                    inputMode="numeric"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-background border border-brand-border text-brand-text text-lg font-medium placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-cta/30 focus:border-cta transition-all"
                    disabled={authLoading}
                  />
                </div>

                {authError && (
                  <p className="text-error text-sm text-center">{authError}</p>
                )}

                <button
                  onPointerDown={(e) => { e.preventDefault(); login(); }}
                  disabled={isDisabled()}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cta to-primary text-white font-display font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {authLoading ? <LoadingSpinner size={24} /> : "Entrar"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
