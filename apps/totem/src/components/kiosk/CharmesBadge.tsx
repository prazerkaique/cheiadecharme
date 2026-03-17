"use client";

import { motion } from "framer-motion";
import { CaretRight } from "@phosphor-icons/react";
import { formatCharmes } from "@/lib/format";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CharmesBadgeProps {
  balance: number;
  onPress: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CharmesBadge({ balance, onPress }: CharmesBadgeProps) {
  return (
    <motion.button
      type="button"
      onPointerDown={(e) => {
        e.preventDefault();
        onPress();
      }}
      whileTap={{ scale: 0.97 }}
      className="w-full flex items-center gap-4 px-7 py-5 rounded-[20px] glass-strong border border-cta/30 cursor-pointer active:scale-[0.97] transition-all duration-150"
      style={{ minHeight: "80px", WebkitTapHighlightColor: "transparent" }}
    >
      {/* Charme icon */}
      <span
        className="flex items-center justify-center shrink-0 rounded-full"
        style={{
          width: 52,
          height: 52,
          background: "linear-gradient(135deg, rgba(194,24,91,0.15), rgba(217,75,140,0.10))",
        }}
      >
        <span className="text-[28px] leading-none" style={{ color: "var(--color-cta)" }}>
          ✦
        </span>
      </span>

      {/* Label */}
      <span className="text-[26px] font-body font-semibold text-brand-text leading-tight">
        Meus Charmes
      </span>

      {/* Spacer */}
      <span className="flex-1" />

      {/* Balance */}
      <span className="text-[28px] font-body font-bold text-cta leading-tight">
        {formatCharmes(balance)}
      </span>

      {/* Chevron */}
      <CaretRight size={24} className="text-brand-text-muted shrink-0" weight="bold" />
    </motion.button>
  );
}
