"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useProfessionalStore } from "@/store/professional-store";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { LoginScreen } from "@/components/screens/LoginScreen";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { TicketScreen } from "@/components/screens/TicketScreen";
import { ActiveServiceScreen } from "@/components/screens/ActiveServiceScreen";
import { EarningsScreen } from "@/components/screens/EarningsScreen";

const ease = [0.22, 1, 0.36, 1] as const;

export function AppShell() {
  const screen = useProfessionalStore((s) => s.screen);
  const confirmDialog = useProfessionalStore((s) => s.confirmDialog);
  const setConfirmDialog = useProfessionalStore((s) => s.setConfirmDialog);
  const completeService = useProfessionalStore((s) => s.completeService);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25, ease }}
        >
          {screen === "login" && <LoginScreen />}
          {screen === "home" && <HomeScreen />}
          {screen === "ticket" && <TicketScreen />}
          {screen === "active" && <ActiveServiceScreen />}
          {screen === "earnings" && <EarningsScreen />}
        </motion.div>
      </AnimatePresence>

      {confirmDialog && (
        <ConfirmDialog
          title="Finalizar Atendimento?"
          description="O atendimento sera marcado como concluido."
          confirmLabel="Finalizar"
          variant="primary"
          onConfirm={() => completeService(confirmDialog.slotId)}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </>
  );
}
