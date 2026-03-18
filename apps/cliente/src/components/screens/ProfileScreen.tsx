"use client";

import { motion } from "framer-motion";
import { User, Phone, Mail, LogOut, ChevronRight, History, Gem, HelpCircle } from "lucide-react";
import { useClientStore } from "@/store/client-store";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProfileScreen() {
  const profile = useClientStore((s) => s.profile);
  const charmes = useClientStore((s) => s.charmes);
  const logout = useClientStore((s) => s.logout);
  const navigate = useClientStore((s) => s.navigate);

  const firstName = profile?.name?.split(" ")[0] ?? "Cliente";
  const initials = profile?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "?";

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="glass-strong rounded-2xl p-5 flex items-center gap-4"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-cta flex items-center justify-center text-white font-display font-bold text-xl">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-display font-bold text-brand-text truncate">
            {profile?.name ?? "Cliente"}
          </h2>
          {profile?.phone && (
            <p className="text-sm text-brand-text-muted flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              {profile.phone}
            </p>
          )}
          {profile?.email && (
            <p className="text-sm text-brand-text-muted flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" />
              {profile.email}
            </p>
          )}
        </div>
      </motion.div>

      {/* Charmes summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease, delay: 0.1 }}
        className="glass-strong rounded-2xl p-4 flex items-center gap-3"
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-cta flex items-center justify-center">
          <Gem className="w-5.5 h-5.5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-brand-text-muted">Charmes</p>
          <p className="text-xl font-display font-bold text-brand-text">{charmes?.balance ?? 0}</p>
        </div>
      </motion.div>

      {/* Menu items */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease, delay: 0.15 }}
        className="glass-strong rounded-2xl divide-y divide-brand-border/30"
      >
        {[
          { icon: History, label: "Historico", action: () => navigate("history") },
          { icon: Gem, label: "Extrato de Charmes", action: () => navigate("charmes") },
          { icon: HelpCircle, label: "Ajuda", action: () => {} },
        ].map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            onPointerDown={(e) => { e.preventDefault(); action(); }}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface/50 transition-colors"
          >
            <Icon className="w-5 h-5 text-brand-text-muted" />
            <span className="flex-1 text-sm text-brand-text text-left">{label}</span>
            <ChevronRight className="w-4 h-4 text-brand-text-muted" />
          </button>
        ))}
      </motion.div>

      {/* Logout */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease, delay: 0.2 }}
        onPointerDown={(e) => { e.preventDefault(); logout(); }}
        className="w-full glass-strong rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:bg-error/5 transition-colors"
      >
        <LogOut className="w-5 h-5 text-error" />
        <span className="text-sm font-semibold text-error">Sair da conta</span>
      </motion.button>
    </div>
  );
}
