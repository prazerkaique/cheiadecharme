"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, DeviceMobileCamera } from "@phosphor-icons/react";
import NumericKeypad from "@/components/kiosk/NumericKeypad";
import ScreenLayout from "@/components/kiosk/ScreenLayout";
import { useKioskStore, type IdentifyMethod } from "@/store/kiosk-store";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STEP_LABELS = ["Identificação", "Serviço", "Confirmação", "Concluído"];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const fadeSlideVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const fadeSlideTransition = {
  duration: 0.3,
  ease: "easeOut" as const,
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function isInputValid(value: string, method: IdentifyMethod): boolean {
  if (method === "cpf") return value.length === 11;
  if (method === "phone") return value.length === 11;
  return false;
}

// ---------------------------------------------------------------------------
// Method selection card
// ---------------------------------------------------------------------------

interface MethodCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onSelect: () => void;
}

function MethodCard({ icon, title, subtitle, onSelect }: MethodCardProps) {
  return (
    <motion.button
      type="button"
      onPointerDown={(e) => {
        e.preventDefault();
        onSelect();
      }}
      whileTap={{ scale: 0.97 }}
      className={[
        // Layout
        "glass-strong flex flex-col items-center justify-center gap-6",
        "w-full min-h-[360px] p-10 rounded-[28px]",
        // Border
        "border border-white/60",
        // Interaction
        "transition-all duration-200",
        "cursor-pointer",
        "active:border-primary/30 active:card-elevated",
      ].join(" ")}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Icon circle with gradient bg */}
      <div
        className="flex items-center justify-center w-28 h-28 rounded-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(217,75,140,0.15) 0%, rgba(194,24,91,0.10) 100%)",
        }}
      >
        <span className="text-primary">{icon}</span>
      </div>

      {/* Labels */}
      <div className="flex flex-col items-center gap-3">
        <span className="font-body text-[34px] font-semibold text-brand-text">
          {title}
        </span>
        <span className="font-body text-[24px] text-brand-text-muted">
          {subtitle}
        </span>
      </div>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Method selection view
// ---------------------------------------------------------------------------

function MethodSelectionView() {
  const setIdentifyMethod = useKioskStore((s) => s.setIdentifyMethod);
  const setInputValue = useKioskStore((s) => s.setInputValue);

  function handleSelect(method: IdentifyMethod) {
    setInputValue("");
    setIdentifyMethod(method);
  }

  return (
    <motion.div
      key="method-selection"
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={fadeSlideTransition}
      className="flex flex-col items-center gap-10 w-full"
    >
      <p className="font-body text-[24px] text-brand-text-muted text-center opacity-80">
        Usaremos seus dados apenas para localizar seu cadastro
      </p>

      <div className="grid grid-cols-2 gap-6 w-full">
        <MethodCard
          icon={<CreditCard size={52} weight="light" />}
          title="CPF"
          subtitle="Digite seu CPF"
          onSelect={() => handleSelect("cpf")}
        />
        <MethodCard
          icon={<DeviceMobileCamera size={52} weight="light" />}
          title="Telefone"
          subtitle="Digite seu número"
          onSelect={() => handleSelect("phone")}
        />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Keypad view
// ---------------------------------------------------------------------------

interface KeypadViewProps {
  method: IdentifyMethod;
}

function KeypadView({ method }: KeypadViewProps) {
  const inputValue = useKioskStore((s) => s.inputValue);
  const setInputValue = useKioskStore((s) => s.setInputValue);
  const setIdentifyMethod = useKioskStore((s) => s.setIdentifyMethod);

  function handleBackToMethodSelection() {
    setInputValue("");
    (setIdentifyMethod as (m: IdentifyMethod | null) => void)(null);
  }

  const methodLabel = method === "cpf" ? "CPF" : "Telefone";
  const MethodIcon =
    method === "cpf" ? (
      <CreditCard size={20} weight="light" />
    ) : (
      <DeviceMobileCamera size={20} weight="light" />
    );

  return (
    <motion.div
      key="keypad-view"
      variants={fadeSlideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={fadeSlideTransition}
      className="flex flex-col items-center gap-8 w-full"
    >
      {/* Method badge + Mudar button */}
      <div className="flex items-center gap-3">
        {/* Glass pill showing selected method */}
        <div className="glass flex items-center gap-2 px-5 py-3 rounded-full border border-glass-border">
          <span className="text-primary">{MethodIcon}</span>
          <span className="font-body font-semibold text-[24px] text-brand-text">
            {methodLabel}
          </span>
        </div>

        {/* Mudar button */}
        <motion.button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            handleBackToMethodSelection();
          }}
          whileTap={{ scale: 0.97 }}
          className="glass flex items-center justify-center min-h-[64px] px-8 rounded-full border border-glass-border font-body font-medium text-[24px] text-brand-text-muted transition-colors duration-150 active:text-brand-text"
        >
          Mudar
        </motion.button>
      </div>

      {/* Numeric keypad */}
      <div className="w-full max-w-[720px]">
        <NumericKeypad
          value={inputValue}
          onChange={setInputValue}
          mask={method}
          maxLength={11}
        />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main screen component
// ---------------------------------------------------------------------------

export default function IdentifyScreen() {
  const identifyMethod = useKioskStore((s) => s.identifyMethod);
  const inputValue = useKioskStore((s) => s.inputValue);
  const reset = useKioskStore((s) => s.reset);
  const clientFound = useKioskStore((s) => s.clientFound);
  const clientNotFound = useKioskStore((s) => s.clientNotFound);

  const isValid =
    identifyMethod !== null
      ? isInputValid(inputValue, identifyMethod)
      : false;

  function handleConfirm() {
    if (!isValid) return;

    if (inputValue === "11111111111") {
      // Maria Silva — COM 3 agendamentos
      const today = new Date().toISOString().slice(0, 10);
      clientFound(
        {
          id: "mock-maria",
          name: "Maria Silva",
          cpf: "111.111.111-11",
          phone: "(21) 99999-0000",
          balance_charmes: 500,
        },
        [
          {
            id: "apt-1",
            service_name: "Escova Progressiva",
            scheduled_at: `${today}T14:30:00`,
            professional_name: "Ana Paula",
          },
          {
            id: "apt-2",
            service_name: "Manicure em Gel",
            scheduled_at: `${today}T15:45:00`,
            professional_name: "Juliana Costa",
          },
          {
            id: "apt-3",
            service_name: "Hidratação Profunda",
            scheduled_at: `${today}T16:30:00`,
            professional_name: null,
          },
        ]
      );
    } else if (inputValue === "00000000000") {
      // Joana Santos — SEM agendamentos
      clientFound(
        {
          id: "mock-joana",
          name: "Joana Santos",
          cpf: "000.000.000-00",
          phone: "(21) 98888-0000",
          balance_charmes: 120,
        },
        []
      );
    } else {
      // Não encontrado → cadastro
      clientNotFound();
    }
  }

  return (
    <ScreenLayout
      title="Identificação"
      subtitle="Como deseja se identificar?"
      currentStep={0}
      totalSteps={4}
      stepLabels={STEP_LABELS}
      backAction={reset}
      primaryAction={
        identifyMethod !== null
          ? {
              label: "Confirmar",
              onClick: handleConfirm,
              disabled: !isValid,
            }
          : undefined
      }
    >
      <AnimatePresence mode="wait">
        {identifyMethod === null ? (
          <MethodSelectionView key="method-selection" />
        ) : (
          <KeypadView key={`keypad-${identifyMethod}`} method={identifyMethod} />
        )}
      </AnimatePresence>
    </ScreenLayout>
  );
}
