"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Tag, Calendar } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useClientStore } from "@/store/client-store";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCents, formatDate } from "@/lib/format";

const ease = [0.22, 1, 0.36, 1] as const;

export function PromotionsScreen() {
  const promotions = useClientStore((s) => s.promotions);
  const loadPromotions = useClientStore((s) => s.loadPromotions);

  useEffect(() => {
    loadPromotions();
  }, [loadPromotions]);

  return (
    <div className="max-w-lg mx-auto">
      <Header title="Promocoes" showBack />

      <div className="px-4 py-4">
        {promotions.length === 0 ? (
          <EmptyState icon={Tag} title="Nenhuma promocao" description="As promocoes ativas aparecerão aqui" />
        ) : (
          <div className="space-y-3">
            {promotions.map((promo, i) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease, delay: i * 0.05 }}
                className="glass-strong rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
                    <Tag className="w-5.5 h-5.5 text-warning" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-display font-semibold text-brand-text">
                      {promo.title}
                    </h4>
                    {promo.description && (
                      <p className="text-sm text-brand-text-muted mt-1">{promo.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {promo.discount_percent && (
                    <span className="px-3 py-1 rounded-full bg-cta/10 text-cta text-xs font-bold">
                      {promo.discount_percent}% OFF
                    </span>
                  )}
                  {promo.discount_amount_cents && (
                    <span className="px-3 py-1 rounded-full bg-cta/10 text-cta text-xs font-bold">
                      {formatCents(promo.discount_amount_cents)} OFF
                    </span>
                  )}
                  {promo.ends_at && (
                    <span className="flex items-center gap-1 text-xs text-brand-text-muted">
                      <Calendar className="w-3.5 h-3.5" />
                      Ate {formatDate(promo.ends_at)}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
