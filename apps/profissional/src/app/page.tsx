"use client";

import { useEffect } from "react";
import { useProfessionalStore } from "@/store/professional-store";
import { AppShell } from "@/components/layout/AppShell";
import { Toast } from "@/components/ui/Toast";

export default function ProfissionalPage() {
  const tick = useProfessionalStore((s) => s.tick);
  const toasts = useProfessionalStore((s) => s.toasts);
  const dismissToast = useProfessionalStore((s) => s.dismissToast);

  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  return (
    <div className="min-h-dvh w-screen gradient-mesh-animated">
      <div className="relative z-10">
        <AppShell />
      </div>

      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
