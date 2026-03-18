"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

interface ToastProps {
  message: string;
  type: "success" | "error";
  onDismiss: () => void;
}

export function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const Icon = type === "success" ? CheckCircle : XCircle;
  const color = type === "success" ? "text-success" : "text-error";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.25, ease }}
      className="glass-strong rounded-xl px-4 py-3 flex items-center gap-3 min-w-[260px] max-w-[340px] shadow-lg"
    >
      <Icon className={`w-5 h-5 ${color} shrink-0`} />
      <span className="text-sm text-brand-text flex-1">{message}</span>
      <button onPointerDown={onDismiss} className="text-brand-text-muted p-1">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
