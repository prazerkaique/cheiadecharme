"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Clock } from "@phosphor-icons/react";
import { useKioskStore } from "@/store/kiosk-store";
import ScreenLayout from "@/components/kiosk/ScreenLayout";
import CharmesBadge from "@/components/kiosk/CharmesBadge";
import CharmesWalletModal, {
  MOCK_TRANSACTIONS,
} from "@/components/kiosk/CharmesWalletModal";
import CharmesBuyModal from "@/components/kiosk/CharmesBuyModal";
import { createAppointment } from "@/lib/queries/appointments";

import { formatCharmes } from "@/lib/format";

// ---------------------------------------------------------------------------
// Animation variants — staggered entry for content sections
// ---------------------------------------------------------------------------

function fadeUp(delay: number): Variants {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const, delay },
    },
  };
}

// ---------------------------------------------------------------------------
// Stepper config
// ---------------------------------------------------------------------------

const STEP_LABELS = ["Identificação", "Serviço", "Confirmação", "Concluído"];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ConfirmScreen() {
  const client = useKioskStore((s) => s.client);
  const cart = useKioskStore((s) => s.cart);
  const professionalsByService = useKioskStore((s) => s.professionalsByService);
  const appointmentConfirmed = useKioskStore((s) => s.appointmentConfirmed);

  const showWallet = useKioskStore((s) => s.showWallet);
  const showBuyCharmes = useKioskStore((s) => s.showBuyCharmes);
  const buyCharmesDeficit = useKioskStore((s) => s.buyCharmesDeficit);
  const openWallet = useKioskStore((s) => s.openWallet);
  const closeWallet = useKioskStore((s) => s.closeWallet);
  const openBuyCharmes = useKioskStore((s) => s.openBuyCharmes);
  const closeBuyCharmes = useKioskStore((s) => s.closeBuyCharmes);
  const addCharmes = useKioskStore((s) => s.addCharmes);

  const [smsOptIn, setSmsOptIn] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);

  const cartTotal = useMemo(
    () => cart.reduce((sum, s) => sum + s.price_charmes, 0),
    [cart]
  );

  const totalDuration = useMemo(
    () => cart.reduce((sum, s) => sum + s.duration_minutes, 0),
    [cart]
  );

  const insufficientBalance = client !== null && client.balance_charmes < cartTotal;
  const deficit = insufficientBalance ? cartTotal - client.balance_charmes : 0;

  async function handleConfirm() {
    if (isConfirming || insufficientBalance) return;
    setIsConfirming(true);
    try {
      const appointment = await createAppointment(
        client!.id,
        cart,
        professionalsByService
      );
      appointmentConfirmed(appointment);
    } catch {
      setIsConfirming(false);
    }
  }

  function handleBack() {
    useKioskStore.setState({ step: "select_service" });
  }

  return (
    <ScreenLayout
      title="Confirme seu Atendimento"
      subtitle="Revise os detalhes abaixo"
      currentStep={2}
      totalSteps={4}
      stepLabels={STEP_LABELS}
      backAction={handleBack}
      primaryAction={{
        label: isConfirming ? "Confirmando..." : "Confirmar e Entrar na Fila",
        onClick: handleConfirm,
        loading: isConfirming,
        disabled: insufficientBalance,
      }}
      secondaryAction={{
        label: "Voltar",
        onClick: handleBack,
      }}
    >
      <div className="flex flex-col gap-6 h-full">

        {/* Charmes wallet badge */}
        {client && (
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            animate="visible"
          >
            <CharmesBadge
              balance={client.balance_charmes}
              onPress={openWallet}
            />
          </motion.div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Summary card                                                      */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          className="glass-strong rounded-[28px] p-8 w-full flex flex-col gap-0"
          variants={fadeUp(0)}
          initial="hidden"
          animate="visible"
        >
          {/* Client name */}
          {client !== null && client !== undefined && (
            <>
              <SummaryRow
                label="Cliente"
                value={client.name}
                valueClassName="text-[28px] font-bold text-brand-text"
              />
              <GradientDivider />
            </>
          )}

          {/* Services + professionals */}
          {cart.length > 0 && (
            <>
              <div className="py-5">
                <span className="text-[24px] font-body font-semibold text-brand-text-muted uppercase tracking-[0.15em]">
                  Serviços
                </span>
                <div className="flex flex-col gap-4 mt-3">
                  {cart.map((service) => {
                    const prof = professionalsByService[service.id];
                    const profLabel = !prof || prof.id === "any" ? "Qualquer disponível" : prof.name;
                    return (
                      <div key={service.id} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[26px] font-body text-brand-text">
                            {service.name}
                          </span>
                          <span className="text-[26px] font-body font-semibold text-brand-text">
                            {formatCharmes(service.price_charmes)}
                          </span>
                        </div>
                        <span className="text-[22px] font-body text-brand-text-muted">
                          {profLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <GradientDivider />

              {/* Total */}
              <SummaryRow
                label="Total"
                value={formatCharmes(cartTotal)}
                valueClassName="text-[30px] font-bold text-cta"
              />
              <GradientDivider />

              {/* Balance vs Total */}
              {client && (
                <>
                  <SummaryRow
                    label="Seu Saldo"
                    value={formatCharmes(client.balance_charmes)}
                    valueClassName={[
                      "text-[30px] font-bold",
                      client.balance_charmes >= cartTotal ? "text-green-600" : "text-amber-600",
                    ].join(" ")}
                  />
                  {insufficientBalance && (
                    <div className="flex flex-col gap-4 px-5 py-5 rounded-[18px] bg-amber-50/80 border border-amber-200 mb-2">
                      <span className="text-[24px] font-body font-semibold text-amber-700">
                        Faltam {formatCharmes(deficit)} para completar
                      </span>
                      <button
                        type="button"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          openBuyCharmes(deficit);
                        }}
                        className="w-full flex items-center justify-center gap-3 font-body font-semibold text-white active:scale-[0.97] transition-all duration-150"
                        style={{
                          minHeight: "80px",
                          borderRadius: "18px",
                          fontSize: "28px",
                          background: "linear-gradient(to right, #C2185B, #8B5CF6)",
                        }}
                      >
                        Recarregar agora ✦
                      </button>
                    </div>
                  )}
                  <GradientDivider />
                </>
              )}

              {/* Duration */}
              <SummaryRow
                label="Duração estimada"
                value={`${totalDuration} minutos`}
                valueClassName="text-[24px] text-brand-text"
              />
            </>
          )}
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* Queue info banner                                                  */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          className="glass w-full rounded-[20px] overflow-hidden"
          variants={fadeUp(0.08)}
          initial="hidden"
          animate="visible"
        >
          {/* Gradient left-border accent */}
          <div className="flex">
            <div
              aria-hidden="true"
              className="w-1 shrink-0 rounded-l-[20px]"
              style={{
                background: "linear-gradient(to bottom, #C2185B, #D94B8C)",
              }}
            />
            <div className="flex items-center gap-4 px-6 py-5 flex-1">
              <Clock
                size={26}
                className="text-cta shrink-0"
                weight="light"
                aria-hidden="true"
              />
              <p className="text-[24px] font-body font-medium text-brand-text leading-snug">
                Você será adicionado(a) à fila de espera
              </p>
            </div>
          </div>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* SMS opt-in toggle                                                  */}
        {/* ---------------------------------------------------------------- */}
        <motion.button
          type="button"
          role="checkbox"
          aria-checked={smsOptIn}
          onPointerDown={(e) => {
            e.preventDefault();
            setSmsOptIn((v) => !v);
          }}
          className={[
            "w-full flex items-center gap-5 px-6 py-5 rounded-[20px]",
            "min-h-[80px] text-left",
            "active:scale-[0.98] transition-all duration-120",
            smsOptIn
              ? "glass-strong border border-cta/30"
              : "glass border border-glass-border",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-cta",
          ].join(" ")}
          variants={fadeUp(0.14)}
          initial="hidden"
          animate="visible"
        >
          {/* Toggle pill */}
          <div
            className="relative shrink-0 w-16 h-9 rounded-full transition-all duration-250"
            style={
              smsOptIn
                ? { background: "linear-gradient(to right, #C2185B, #D94B8C)" }
                : { background: "rgba(249,209,226,0.8)", border: "1.5px solid rgba(217,75,140,0.25)" }
            }
            aria-hidden="true"
          >
            <span
              className={[
                "absolute top-1 w-7 h-7 rounded-full bg-white shadow-md transition-transform duration-250",
                smsOptIn ? "translate-x-8" : "translate-x-1",
              ].join(" ")}
            />
          </div>

          <span className="text-[24px] font-body font-medium text-brand-text leading-snug">
            Receber SMS quando for minha vez
          </span>
        </motion.button>

        {/* Charmes Wallet Modal */}
        {showWallet && client && (
          <CharmesWalletModal
            balance={client.balance_charmes}
            transactions={MOCK_TRANSACTIONS}
            onBuyMore={openBuyCharmes}
            onClose={closeWallet}
          />
        )}

        {/* Charmes Buy Modal */}
        {showBuyCharmes && (
          <CharmesBuyModal
            deficit={buyCharmesDeficit ?? undefined}
            onClose={closeBuyCharmes}
            onPaid={addCharmes}
          />
        )}
      </div>
    </ScreenLayout>
  );
}

// ---------------------------------------------------------------------------
// SummaryRow
// ---------------------------------------------------------------------------

interface SummaryRowProps {
  label: string;
  value: string;
  valueClassName?: string;
}

function SummaryRow({ label, value, valueClassName = "" }: SummaryRowProps) {
  return (
    <div className="flex flex-col gap-1 py-5">
      <span className="text-[24px] font-body font-semibold text-brand-text-muted uppercase tracking-[0.15em]">
        {label}
      </span>
      <span className={["font-body", valueClassName].join(" ")}>{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// GradientDivider — 1px line, fades in from transparent
// ---------------------------------------------------------------------------

function GradientDivider() {
  return (
    <div
      aria-hidden="true"
      className="w-full h-px"
      style={{
        background: "linear-gradient(to right, transparent, rgba(217,75,140,0.25), transparent)",
      }}
    />
  );
}
