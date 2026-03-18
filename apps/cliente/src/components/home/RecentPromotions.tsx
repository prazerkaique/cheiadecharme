"use client";

import { motion } from "framer-motion";
import { Tag, ChevronRight } from "lucide-react";
import { useClientStore } from "@/store/client-store";
import { formatDate } from "@/lib/format";

const ease = [0.22, 1, 0.36, 1] as const;

export function RecentPromotions() {
  const promotions = useClientStore((s) => s.promotions);
  const navigate = useClientStore((s) => s.navigate);

  if (promotions.length === 0) return null;

  const recent = promotions.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.25 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-display font-semibold text-brand-text">Promocoes</h3>
        <button
          onPointerDown={(e) => { e.preventDefault(); navigate("promotions"); }}
          className="text-xs text-cta font-semibold flex items-center gap-0.5"
        >
          Ver todas <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-2 -mx-1 px-1">
        {recent.map((promo) => (
          <div
            key={promo.id}
            className="glass-strong rounded-xl p-3 min-w-[200px] max-w-[220px] shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center mb-2">
              <Tag className="w-4.5 h-4.5 text-warning" />
            </div>
            <h4 className="text-sm font-display font-semibold text-brand-text mb-1 line-clamp-1">
              {promo.title}
            </h4>
            <p className="text-xs text-brand-text-muted line-clamp-2 mb-2">
              {promo.description}
            </p>
            {promo.discount_percent && (
              <span className="text-xs font-bold text-cta">{promo.discount_percent}% OFF</span>
            )}
            {promo.ends_at && (
              <p className="text-[11px] text-brand-text-muted mt-1">
                Ate {formatDate(promo.ends_at)}
              </p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
