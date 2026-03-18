"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { useProfessionalStore } from "@/store/professional-store";

const ease = [0.22, 1, 0.36, 1] as const;

export function LoginScreen() {
  const login = useProfessionalStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    login(email, password);
  };

  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease }}
        className="glass-strong w-full max-w-[var(--pro-max-w)] rounded-[var(--radius-xl)] p-8"
      >
        <div className="flex flex-col items-center gap-3 mb-8">
          <Image
            src="/logo.png"
            alt="Cheia de Charme"
            width={64}
            height={64}
            className="rounded-full"
          />
          <h1 className="font-display text-[var(--text-title)] font-bold text-brand-text">
            Cheia de Charme
          </h1>
          <p className="text-[var(--text-body)] text-brand-text-muted">
            Area do Profissional
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              autoComplete="email"
              className="glass h-14 w-full rounded-[var(--radius-md)] pl-11 pr-4 text-[var(--text-body)] font-medium text-brand-text placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              autoComplete="current-password"
              className="glass h-14 w-full rounded-[var(--radius-md)] pl-11 pr-4 text-[var(--text-body)] font-medium text-brand-text placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <button
            type="submit"
            disabled={!email.trim() || !password.trim()}
            className="mt-2 w-full rounded-[var(--radius-md)] bg-cta py-4 text-[var(--text-body)] font-bold text-white transition hover:bg-cta-soft glow-cta disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Entrar
          </button>
        </form>
      </motion.div>
    </div>
  );
}
