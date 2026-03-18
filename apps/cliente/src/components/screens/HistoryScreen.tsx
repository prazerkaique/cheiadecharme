"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useClientStore } from "@/store/client-store";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCents, formatDate, formatTime, getMonthYear } from "@/lib/format";

const ease = [0.22, 1, 0.36, 1] as const;

export function HistoryScreen() {
  const appointments = useClientStore((s) => s.appointments);
  const loadHistory = useClientStore((s) => s.loadHistory);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const past = useMemo(() => {
    return appointments
      .filter((a) => a.status === "completed" || a.status === "no_show")
      .sort((a, b) => new Date(b.scheduled_at ?? b.created_at).getTime() - new Date(a.scheduled_at ?? a.created_at).getTime());
  }, [appointments]);

  // Group by month
  const grouped = useMemo(() => {
    const map = new Map<string, typeof past>();
    past.forEach((a) => {
      const key = getMonthYear(a.scheduled_at ?? a.created_at);
      const arr = map.get(key) ?? [];
      arr.push(a);
      map.set(key, arr);
    });
    return Array.from(map.entries());
  }, [past]);

  return (
    <div className="max-w-lg mx-auto">
      <Header title="Historico" showBack />

      <div className="px-4 py-4">
        {past.length === 0 ? (
          <EmptyState icon={Clock} title="Nenhum atendimento" description="Seu historico de atendimentos aparecera aqui" />
        ) : (
          <div className="space-y-6">
            {grouped.map(([month, appointments]) => (
              <div key={month}>
                <h3 className="text-sm font-semibold text-brand-text-muted uppercase tracking-wide mb-3 px-1">
                  {month}
                </h3>
                <div className="space-y-2">
                  {appointments.map((appt, i) => {
                    const isCompleted = appt.status === "completed";
                    return (
                      <motion.div
                        key={appt.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, ease, delay: i * 0.03 }}
                        className="glass-strong rounded-xl p-3 flex items-center gap-3"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isCompleted ? "bg-success/10" : "bg-error/10"}`}>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-success" />
                          ) : (
                            <XCircle className="w-5 h-5 text-error" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-brand-text truncate">
                            {appt.service_name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-brand-text-muted mt-0.5">
                            <span>{formatDate(appt.scheduled_at ?? appt.created_at)}</span>
                            {appt.scheduled_at && <span>{formatTime(appt.scheduled_at)}</span>}
                            {appt.professional_name && (
                              <span>• {appt.professional_name.split(" ")[0]}</span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-bold text-brand-text">
                          {formatCents(appt.price_cents)}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
