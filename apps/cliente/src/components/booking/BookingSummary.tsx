"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, User, Scissors, CreditCard } from "lucide-react";
import { useClientStore } from "@/store/client-store";
import { formatCents } from "@/lib/format";

const ease = [0.22, 1, 0.36, 1] as const;

const WEEKDAYS = ["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"];

export function BookingSummary() {
  const services = useClientStore((s) => s.services);
  const professionals = useClientStore((s) => s.professionals);
  const selectedServiceId = useClientStore((s) => s.selectedServiceId);
  const selectedProfessionalId = useClientStore((s) => s.selectedProfessionalId);
  const selectedDate = useClientStore((s) => s.selectedDate);
  const selectedTime = useClientStore((s) => s.selectedTime);
  const setBookingStep = useClientStore((s) => s.setBookingStep);

  const service = services.find((s) => s.id === selectedServiceId);
  const professional = professionals.find((p) => p.id === selectedProfessionalId);

  if (!service || !selectedDate || !selectedTime) return null;

  const dateObj = new Date(`${selectedDate}T${selectedTime}:00`);
  const dateStr = `${WEEKDAYS[dateObj.getDay()]}, ${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

  const handlePayment = () => {
    setBookingStep("payment");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="space-y-4"
    >
      <h3 className="text-base font-display font-semibold text-brand-text px-1">
        Confirme seu agendamento
      </h3>

      <div className="glass-strong rounded-2xl p-5 space-y-4">
        {/* Service */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Scissors className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-brand-text">{service.name}</p>
            <p className="text-xs text-brand-text-muted">{service.category}</p>
          </div>
          <span className="text-sm font-bold text-cta">{formatCents(service.price_cents)}</span>
        </div>

        <div className="h-px bg-brand-border/50" />

        {/* Professional */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm text-brand-text">
            {professional ? professional.name : "Qualquer disponivel"}
          </p>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm text-brand-text">{dateStr}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm text-brand-text">
            {selectedTime} ({service.duration_minutes} min)
          </p>
        </div>
      </div>

      <button
        onPointerDown={(e) => { e.preventDefault(); handlePayment(); }}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-cta to-primary text-white font-display font-semibold text-lg transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <CreditCard className="w-5 h-5" />
        Pagar e confirmar
      </button>
    </motion.div>
  );
}
