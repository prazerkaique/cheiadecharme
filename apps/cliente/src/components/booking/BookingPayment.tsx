"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Check, Scissors, DollarSign } from "lucide-react";
import { useClientStore } from "@/store/client-store";
import { formatCents } from "@/lib/format";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const ease = [0.22, 1, 0.36, 1] as const;

export function BookingPayment() {
  const services = useClientStore((s) => s.services);
  const selectedServiceId = useClientStore((s) => s.selectedServiceId);
  const confirmBooking = useClientStore((s) => s.confirmBooking);
  const [paying, setPaying] = useState(false);

  const service = services.find((s) => s.id === selectedServiceId);

  if (!service) return null;

  const handlePay = async () => {
    setPaying(true);
    await confirmBooking();
    setPaying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="space-y-5"
    >
      <h3 className="text-base font-display font-semibold text-brand-text px-1">
        Pagamento via Pix
      </h3>

      {/* Service summary */}
      <div className="glass-strong rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Scissors className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-brand-text">{service.name}</p>
          <p className="text-xs text-brand-text-muted">{service.category}</p>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-cta" />
          <span className="text-lg font-bold text-cta">{formatCents(service.price_cents)}</span>
        </div>
      </div>

      {/* Mock QR code */}
      <div className="flex justify-center py-3">
        <div className="w-44 h-44 rounded-2xl bg-white border-2 border-brand-border flex items-center justify-center shadow-sm">
          <div className="grid grid-cols-5 gap-1">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-sm ${
                  [0, 1, 2, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 23, 24].includes(i)
                    ? "bg-brand-text"
                    : "bg-transparent"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-cta animate-pulse" />
        <span className="text-sm font-medium text-brand-text-muted">
          Aguardando pagamento...
        </span>
      </div>

      {/* Simulate payment */}
      <button
        disabled={paying}
        onPointerDown={(e) => { e.preventDefault(); handlePay(); }}
        className="w-full py-4 rounded-xl text-white font-display font-semibold text-base disabled:opacity-50 transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(to right, #16a34a, #22c55e)" }}
      >
        {paying ? (
          <LoadingSpinner size={20} />
        ) : (
          <>
            <Check className="w-5 h-5" />
            Simular Pix Pago
          </>
        )}
      </button>

      <p className="text-xs text-center text-brand-text-muted">
        Escaneie o QR Code acima com o app do seu banco para pagar
      </p>
    </motion.div>
  );
}
