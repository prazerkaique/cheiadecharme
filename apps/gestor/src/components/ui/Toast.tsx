"use client";

import { useUIStore } from "@/store/ui-store";
import { CheckCircle, XCircle, X } from "lucide-react";

const PRIMARY_COLOR = "#EC4899";

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);
  const dismissToast = useUIStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex min-w-[300px] max-w-sm cursor-pointer items-center gap-3 rounded-r-xl border-l-4 bg-white p-4 shadow-2xl transition-transform hover:scale-[1.02] animate-slide-in-right"
          style={{ borderColor: toast.type === "success" ? "#10B981" : "#EF4444" }}
        >
          {toast.type === "success" ? (
            <CheckCircle size={18} className="text-green-500" />
          ) : (
            <XCircle size={18} className="text-red-500" />
          )}
          <span className="flex-1 text-sm font-medium text-gray-900">{toast.message}</span>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
