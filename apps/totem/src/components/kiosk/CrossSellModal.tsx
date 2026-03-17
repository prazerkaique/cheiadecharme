"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Bag, Tag } from "@phosphor-icons/react";
import type { KioskService } from "@/store/kiosk-store";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CrossSellModalProps {
  service: KioskService;
  discount: number; // e.g. 20 for 20%
  onAddToCart: () => void;
  onDecline: () => void;
  onAddMore: () => void;
}

import { formatCharmes } from "@/lib/format";

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.22, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: { duration: 0.20, ease: "easeIn" as const },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CrossSellModal({
  service,
  discount,
  onAddToCart,
  onDecline,
  onAddMore,
}: CrossSellModalProps) {
  const originalPrice = service.price_charmes;
  const discountedPrice = Math.round(originalPrice * (1 - discount / 100));

  return (
    <AnimatePresence>
      <motion.div
        className="timeout-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-label="Sugestão de serviço"
      >
        <motion.div
          className="glass-strong w-full flex flex-col items-center gap-8 mx-6"
          style={{
            maxWidth: "680px",
            borderRadius: "32px",
            padding: "48px 40px",
          }}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Service photo / placeholder */}
          <div
            className="w-full rounded-[20px] overflow-hidden"
            style={{ height: 280 }}
          >
            {service.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={service.image_url}
                alt={service.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(217,75,140,0.20), rgba(194,24,91,0.10))",
                }}
              >
                <Bag size={64} className="text-primary/40" weight="light" />
              </div>
            )}
          </div>

          {/* Discount badge */}
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cta/10">
            <Tag size={22} className="text-cta" weight="light" />
            <span className="text-[26px] font-bold font-body text-cta">
              {discount}% OFF
            </span>
          </div>

          {/* Title */}
          <h2
            className="font-display text-brand-text text-center leading-tight"
            style={{ fontSize: "40px", letterSpacing: "-0.01em" }}
          >
            Aproveite! {discount}% off
          </h2>

          {/* Service name */}
          <p className="text-[30px] font-body font-semibold text-brand-text text-center leading-snug">
            {service.name}
          </p>

          {/* Pricing */}
          <div className="flex items-center gap-4">
            <span className="text-[26px] font-body text-brand-text-muted line-through">
              {formatCharmes(originalPrice)}
            </span>
            <span className="text-[36px] font-bold font-body text-cta">
              {formatCharmes(discountedPrice)}
            </span>
          </div>

          {/* CTA: Add to cart */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              onAddToCart();
            }}
            className="w-full flex items-center justify-center glow-cta ring-1 ring-white/20 text-white font-body font-semibold tracking-wide active:scale-[0.98] transition-all duration-150"
            style={{
              minHeight: "120px",
              borderRadius: "22px",
              fontSize: "34px",
              background: "linear-gradient(to right, #C2185B, #D94B8C)",
            }}
          >
            Adicionar ao carrinho
          </button>

          {/* Secondary: decline */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              onDecline();
            }}
            className="w-full flex items-center justify-center glass-strong border border-brand-border text-brand-text font-body font-medium active:scale-[0.98] transition-all duration-150"
            style={{
              minHeight: "90px",
              borderRadius: "22px",
              fontSize: "26px",
            }}
          >
            Não, obrigado
          </button>

          {/* Link: add another service */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              onAddMore();
            }}
            className="text-[24px] font-body font-medium text-cta underline underline-offset-4 active:opacity-70 transition-opacity py-2"
          >
            Adicionar outro serviço
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
