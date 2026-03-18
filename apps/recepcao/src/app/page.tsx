"use client";

import { useEffect } from "react";
import { useReceptionStore } from "@/store/reception-store";
import { AppShell } from "@/components/layout/AppShell";
import { Toast } from "@/components/ui/Toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function ReceptionPage() {
  const tick = useReceptionStore((s) => s.tick);
  const toasts = useReceptionStore((s) => s.toasts);
  const dismissToast = useReceptionStore((s) => s.dismissToast);
  const confirmDialog = useReceptionStore((s) => s.confirmDialog);
  const setConfirmDialog = useReceptionStore((s) => s.setConfirmDialog);
  const completeService = useReceptionStore((s) => s.completeService);
  const markNoShow = useReceptionStore((s) => s.markNoShow);

  useEffect(() => {
    useReceptionStore.getState().init();
    useReceptionStore.getState().subscribe();
    return () => useReceptionStore.getState().unsubscribe();
  }, []);

  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  return (
    <div className="h-dvh w-screen gradient-mesh-animated">
      <div className="relative z-10 h-full">
        <AppShell />
      </div>

      {/* Toasts */}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 md:bottom-4">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.type === "no_show" ? "Marcar No-Show?" : "Finalizar Atendimento?"}
          description={
            confirmDialog.type === "no_show"
              ? "O cliente sera marcado como ausente."
              : "O atendimento sera finalizado."
          }
          confirmLabel={confirmDialog.type === "no_show" ? "Confirmar No-Show" : "Finalizar"}
          variant={confirmDialog.type === "no_show" ? "destructive" : "primary"}
          onConfirm={() => {
            if (confirmDialog.type === "no_show") {
              markNoShow(confirmDialog.appointmentId);
            } else {
              completeService(confirmDialog.appointmentId);
            }
          }}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}
