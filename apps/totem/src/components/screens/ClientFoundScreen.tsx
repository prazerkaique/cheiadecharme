"use client";

import { useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { CalendarBlank, Check, Clock, User } from "@phosphor-icons/react";
import { useKioskStore } from "@/store/kiosk-store";
import ScreenLayout from "@/components/kiosk/ScreenLayout";
import CharmesBadge from "@/components/kiosk/CharmesBadge";
import CharmesWalletModal, {
  MOCK_TRANSACTIONS,
} from "@/components/kiosk/CharmesWalletModal";
import CharmesBuyModal from "@/components/kiosk/CharmesBuyModal";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STEP_LABELS = ["Identificação", "Serviço", "Confirmação", "Concluído"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(scheduledAt: string): string {
  try {
    const date = new Date(scheduledAt);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "--:--";
  }
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ---------------------------------------------------------------------------
// SelectableAppointmentCard
// ---------------------------------------------------------------------------

function SelectableAppointmentCard({
  serviceName,
  scheduledAt,
  professionalName,
  selected,
  onSelect,
}: {
  serviceName: string;
  scheduledAt: string;
  professionalName: string | null;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      variants={itemVariants}
      onPointerDown={(e) => {
        e.preventDefault();
        onSelect();
      }}
      whileTap={{ scale: 0.97 }}
      className={[
        "w-full rounded-[20px] p-6 flex items-center gap-5 text-left transition-all duration-200",
        selected
          ? "glass-strong border-2 border-primary/40 shadow-lg"
          : "glass border border-white/60",
      ].join(" ")}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Radio circle */}
      <div
        className={[
          "flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200",
          selected
            ? "border-primary bg-primary"
            : "border-brand-border bg-white/40",
        ].join(" ")}
      >
        {selected && <Check size={20} className="text-white" weight="bold" />}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 flex-1 min-w-0">
        {/* Service name + badge */}
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-[28px] font-bold font-body text-brand-text leading-tight">
            {serviceName}
          </p>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cta/10 text-cta-soft text-[18px] font-medium font-body">
            <CalendarBlank size={14} weight="light" />
            Agendado pelo app
          </span>
        </div>

        {/* Details row */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10">
              <Clock size={14} className="text-primary" weight="light" />
            </span>
            <span className="text-[24px] font-semibold font-body text-brand-text">
              {formatTime(scheduledAt)}
            </span>
          </div>

          <span className="w-1 h-1 rounded-full bg-brand-border" />

          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-cta/10">
              <User size={14} className="text-cta-soft" weight="light" />
            </span>
            <span className="text-[22px] font-body text-brand-text-muted">
              {professionalName ?? "Profissional não definido"}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ClientFoundScreen() {
  const client = useKioskStore((s) => s.client);
  const todayAppointments = useKioskStore((s) => s.todayAppointments);
  const selectedAppointmentId = useKioskStore((s) => s.selectedAppointmentId);
  const selectAppointmentForCheckin = useKioskStore((s) => s.selectAppointmentForCheckin);
  const reset = useKioskStore((s) => s.reset);
  const appointmentConfirmed = useKioskStore((s) => s.appointmentConfirmed);

  const showWallet = useKioskStore((s) => s.showWallet);
  const showBuyCharmes = useKioskStore((s) => s.showBuyCharmes);
  const openWallet = useKioskStore((s) => s.openWallet);
  const closeWallet = useKioskStore((s) => s.closeWallet);
  const openBuyCharmes = useKioskStore((s) => s.openBuyCharmes);
  const closeBuyCharmes = useKioskStore((s) => s.closeBuyCharmes);

  const hasAppointments = todayAppointments.length > 0;

  // Auto-select if only 1 appointment
  useEffect(() => {
    if (todayAppointments.length === 1 && !selectedAppointmentId) {
      selectAppointmentForCheckin(todayAppointments[0].id);
    }
  }, [todayAppointments, selectedAppointmentId, selectAppointmentForCheckin]);

  if (!client) return null;

  const firstName = client.name.split(" ")[0];

  function handleCheckin() {
    if (!selectedAppointmentId) return;
    const apt = todayAppointments.find((a) => a.id === selectedAppointmentId);
    if (!apt) return;
    appointmentConfirmed({
      id: apt.id,
      ticket_number: "#001",
      qr_code: apt.id,
      queue_position: 1,
    });
  }

  function handleSchedule() {
    useKioskStore.setState({ step: "select_service" });
  }

  // Subtitle for appointments
  const appointmentSubtitle =
    todayAppointments.length === 1
      ? "Seu agendamento de hoje"
      : `Seus ${todayAppointments.length} agendamentos de hoje`;

  // Footer actions
  const primaryAction = hasAppointments
    ? { label: "Fazer Check-in", onClick: handleCheckin, disabled: !selectedAppointmentId }
    : { label: "Agendar agora", onClick: handleSchedule };

  const secondaryAction = hasAppointments
    ? { label: "Agendar outro serviço", onClick: handleSchedule }
    : undefined;

  return (
    <ScreenLayout
      title={hasAppointments ? `Olá, ${firstName}!` : ""}
      subtitle={hasAppointments ? appointmentSubtitle : undefined}
      currentStep={0}
      totalSteps={4}
      stepLabels={STEP_LABELS}
      backAction={reset}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
    >
      <motion.div
        className="flex flex-col items-center w-full h-full gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Charmes wallet badge */}
        <motion.div variants={itemVariants} className="w-full">
          <CharmesBadge
            balance={client.balance_charmes}
            onPress={openWallet}
          />
        </motion.div>

        {hasAppointments ? (
          <>
            {todayAppointments.length > 1 && (
              <motion.p
                variants={itemVariants}
                className="font-body text-[24px] text-brand-text-muted text-center"
              >
                Selecione o agendamento para check-in
              </motion.p>
            )}

            <div className="flex flex-col gap-4 w-full overflow-y-auto">
              {todayAppointments.map((apt) => (
                <SelectableAppointmentCard
                  key={apt.id}
                  serviceName={apt.service_name}
                  scheduledAt={apt.scheduled_at}
                  professionalName={apt.professional_name}
                  selected={selectedAppointmentId === apt.id}
                  onSelect={() => selectAppointmentForCheckin(apt.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-4 text-center"
          >
            <h2
              className="font-display text-[52px] text-brand-text leading-tight"
              style={{ letterSpacing: "-0.015em" }}
            >
              Olá, {firstName}!
            </h2>
            <p className="font-body text-[30px] text-brand-text-muted leading-snug">
              Você não tem agendamentos.{"\n"}O que deseja fazer?
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Charmes Wallet Modal */}
      {showWallet && (
        <CharmesWalletModal
          balance={client.balance_charmes}
          transactions={MOCK_TRANSACTIONS}
          onBuyMore={openBuyCharmes}
          onClose={closeWallet}
        />
      )}

      {/* Charmes Buy Modal */}
      {showBuyCharmes && <CharmesBuyModal onClose={closeBuyCharmes} />}
    </ScreenLayout>
  );
}
