"use client";

import { useEffect } from "react";
import { useClientStore } from "@/store/client-store";
import { AppShell } from "@/components/layout/AppShell";
import { Toast } from "@/components/ui/Toast";

export default function ClientePage() {
  const restoreSession = useClientStore((s) => s.restoreSession);
  const restoringSession = useClientStore((s) => s._restoringSession);
  const toasts = useClientStore((s) => s.toasts);
  const dismissToast = useClientStore((s) => s.dismissToast);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (restoringSession) {
    return (
      <div className="min-h-dvh w-screen gradient-mesh-animated flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-3 border-cta border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-screen gradient-mesh-animated">
      <div className="relative z-10">
        <AppShell />
      </div>

      <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2">
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
