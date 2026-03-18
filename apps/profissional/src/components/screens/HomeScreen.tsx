"use client";

import { motion } from "framer-motion";
import { LogOut, Zap } from "lucide-react";
import { useProfessionalStore } from "@/store/professional-store";
import { Avatar } from "@/components/ui/Avatar";
import { EarningsPeek } from "@/components/home/EarningsPeek";
import { ClientCard } from "@/components/home/ClientCard";

const ease = [0.22, 1, 0.36, 1] as const;

export function HomeScreen() {
  const professional = useProfessionalStore((s) => s.professional);
  const logout = useProfessionalStore((s) => s.logout);
  const getActiveService = useProfessionalStore((s) => s.getActiveService);
  const getUpcomingSlots = useProfessionalStore((s) => s.getUpcomingSlots);
  const goToActive = useProfessionalStore((s) => s.goToActive);

  const active = getActiveService();
  const upcoming = getUpcomingSlots();
  const firstName = professional.name.split(" ")[0];

  return (
    <div className="mx-auto max-w-[var(--pro-max-w)] px-4 py-6 space-y-5">
      {/* Header: avatar + greeting + logout */}
      <div className="flex items-center gap-3">
        <Avatar name={professional.name} url={professional.avatar_url} size="lg" />
        <div className="flex-1 min-w-0">
          <p className="text-[var(--text-small)] text-brand-text-muted">Ola,</p>
          <p className="font-display text-[var(--text-title)] font-bold text-brand-text truncate">
            {firstName}
          </p>
        </div>
        <button
          onClick={logout}
          className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full glass text-brand-text-muted transition hover:text-brand-text"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Earnings peek */}
      <EarningsPeek />

      {/* Active service banner */}
      {active && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease }}
          onClick={goToActive}
          className="w-full glass-strong rounded-[var(--radius-lg)] p-4 flex items-center gap-3 pulse-glow"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Zap size={20} className="text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[var(--text-small)] font-bold uppercase tracking-wide text-primary">
              Atendimento em andamento
            </p>
            <p className="text-[var(--text-body)] font-semibold text-brand-text">
              {active.client_name} — {active.service_name}
            </p>
          </div>
        </motion.button>
      )}

      {/* Upcoming clients */}
      <div>
        <h2 className="mb-3 font-display text-[var(--text-body)] font-bold text-brand-text">
          Proximos Clientes
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-[var(--text-small)] text-brand-text-muted text-center py-8">
            Nenhum cliente agendado
          </p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((slot, i) => (
              <ClientCard key={slot.id} slot={slot} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
