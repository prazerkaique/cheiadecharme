"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTVStore } from "@/store/tv-store";

const ease = [0.22, 1, 0.36, 1] as const;

export function AdOverlay() {
  const ads = useTVStore((s) => s.ads);
  const currentAdIndex = useTVStore((s) => s.currentAdIndex);
  const ad = ads[currentAdIndex];

  if (!ad) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={ad.id}
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #4A0D2E 0%, #D94B8C 50%, #F5B8D3 100%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease }}
      >
        <div className="flex flex-col items-center gap-8 text-center">
          <div
            className="glass-strong px-16 py-8"
            style={{ borderRadius: "var(--radius-xl)" }}
          >
            <span
              className="font-display font-bold text-brand-text"
              style={{ fontSize: "var(--text-call-name)" }}
            >
              {ad.alt}
            </span>
          </div>
          <span className="font-body text-white/80" style={{ fontSize: "var(--text-subtitle)" }}>
            Cheia de Charme
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
