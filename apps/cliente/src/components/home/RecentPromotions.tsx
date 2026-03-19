"use client";

import { motion } from "framer-motion";
import { Tag, ChevronRight, Percent } from "lucide-react";
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
            className="relative rounded-2xl min-w-[260px] max-w-[280px] shrink-0 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(236,72,153,0.06), rgba(139,92,246,0.08))",
              border: "1px solid rgba(236,72,153,0.12)",
            }}
          >
            {/* Discount badge */}
            {promo.discount_percent && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-xs font-bold shadow-sm"
                style={{ background: "linear-gradient(135deg, #EC4899, #8B5CF6)" }}
              >
                <Percent className="w-3 h-3" />
                {promo.discount_percent}% OFF
              </div>
            )}
            {!promo.discount_percent && promo.discount_amount_cents && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-xs font-bold shadow-sm"
                style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}
              >
                R${(promo.discount_amount_cents / 100).toFixed(0)} OFF
              </div>
            )}

            <div className="p-4 pt-3">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center mb-3">
                <Tag className="w-5 h-5 text-warning" />
              </div>
              <h4 className="text-base font-display font-semibold text-brand-text mb-1 line-clamp-1">
                {promo.title}
              </h4>
              <p className="text-sm text-brand-text-muted line-clamp-2 mb-3 leading-relaxed">
                {promo.description}
              </p>
              {promo.ends_at && (
                <p className="text-xs text-brand-text-muted">
                  Ate {formatDate(promo.ends_at)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
