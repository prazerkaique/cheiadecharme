"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useClientStore } from "@/store/client-store";
import { formatCents } from "@/lib/format";

const ease = [0.22, 1, 0.36, 1] as const;

export function ServiceList() {
  const selectedCategory = useClientStore((s) => s.selectedCategory);
  const allServices = useClientStore((s) => s.services);
  const selectService = useClientStore((s) => s.selectService);

  const services = useMemo(
    () => selectedCategory ? allServices.filter((s) => s.category === selectedCategory) : [],
    [allServices, selectedCategory]
  );

  return (
    <div className="space-y-3">
      <h3 className="text-base font-display font-semibold text-brand-text px-1">
        {selectedCategory}
      </h3>
      <div className="space-y-2">
        {services.map((service, i) => (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease, delay: i * 0.04 }}
            onPointerDown={(e) => { e.preventDefault(); selectService(service.id); }}
            className="w-full glass-strong rounded-xl p-4 flex items-center gap-3 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex-1">
              <p className="text-sm font-display font-semibold text-brand-text">
                {service.name}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-brand-text-muted flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {service.duration_minutes} min
                </span>
              </div>
            </div>
            <span className="text-sm font-bold text-cta">
              {formatCents(service.price_cents)}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
