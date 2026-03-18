"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onDismiss: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function Toast({ message, type = "success", onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const Icon = type === "success" ? CheckCircle : XCircle;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3, ease }}
      className="glass-strong flex items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 shadow-lg"
    >
      <Icon
        size={18}
        className={type === "success" ? "text-success" : "text-error"}
      />
      <span className="text-[var(--text-small)] font-medium text-brand-text">
        {message}
      </span>
      <button
        onClick={onDismiss}
        className="ml-2 rounded-full p-1 text-brand-text-muted hover:bg-brand-border transition"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
