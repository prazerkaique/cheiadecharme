"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useKioskStore } from "@/store/kiosk-store";
import QwertyKeyboard from "@/components/kiosk/QwertyKeyboard";
import NumericKeypad from "@/components/kiosk/NumericKeypad";
import ScreenLayout from "@/components/kiosk/ScreenLayout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FormStep = 0 | 1 | 2;

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function isNameValid(name: string): boolean {
  return name.trim().length >= 3;
}

function isCpfValid(cpf: string): boolean {
  return cpf.length === 11;
}

function isPhoneValid(phone: string): boolean {
  return phone.length === 11;
}

// ---------------------------------------------------------------------------
// Step slide animation variants
// ---------------------------------------------------------------------------

const SLIDE_DISTANCE = 56;

const stepVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? SLIDE_DISTANCE : -SLIDE_DISTANCE,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -SLIDE_DISTANCE : SLIDE_DISTANCE,
    transition: { duration: 0.26, ease: [0.4, 0, 1, 1] as const },
  }),
};

// ---------------------------------------------------------------------------
// Sub-stepper indicator (internal form steps: Nome → CPF → Telefone)
// ---------------------------------------------------------------------------

const FORM_STEP_LABELS = ["Nome", "CPF", "Telefone"] as const;

function StepIndicator({ currentStep }: { currentStep: FormStep }) {
  return (
    <div
      className="flex items-center justify-center gap-0"
      aria-label={`Passo ${currentStep + 1} de 3`}
    >
      {([0, 1, 2] as FormStep[]).map((s, idx) => {
        const isActive = currentStep === s;
        const isDone = s < currentStep;

        return (
          <div key={s} className="flex items-center">
            {/* Dot / pill */}
            <div className="flex flex-col items-center gap-2">
              <motion.span
                layout
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                className="block rounded-full"
                style={{
                  width: isActive ? 56 : 20,
                  height: 20,
                  background: isActive
                    ? "linear-gradient(90deg, #D94B8C 0%, #C2185B 100%)"
                    : isDone
                    ? "rgba(236, 72, 153, 0.40)"
                    : "var(--color-brand-border)",
                  transition:
                    "width 0.3s cubic-bezier(0.22,1,0.36,1), background 0.3s ease",
                }}
              />
              {/* Step label */}
              <span
                className="text-[24px] font-body font-medium transition-colors duration-300"
                style={{
                  color: isActive
                    ? "var(--color-primary)"
                    : isDone
                    ? "rgba(74,13,46,0.55)"
                    : "var(--color-brand-border)",
                }}
              >
                {FORM_STEP_LABELS[s]}
              </span>
            </div>

            {/* Connector line between dots */}
            {idx < 2 && (
              <span
                className="block mx-3 mb-8"
                style={{
                  width: 36,
                  height: 1,
                  background: isDone
                    ? "rgba(217,75,140,0.35)"
                    : "var(--color-brand-border)",
                  transition: "background 0.3s ease",
                  borderRadius: 1,
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Field label with validity badge
// ---------------------------------------------------------------------------

function FieldLabel({ label, isValid }: { label: string; isValid: boolean }) {
  return (
    <div className="flex items-center justify-between w-full px-1 mb-1">
      <span className="text-[26px] font-semibold font-body text-brand-text">
        {label}
      </span>
      <AnimatePresence>
        {isValid && (
          <motion.span
            key="valid-badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[20px] font-semibold font-body"
            style={{
              background: "rgba(16,185,129,0.12)",
              color: "#10B981",
              border: "1px solid rgba(16,185,129,0.20)",
            }}
          >
            {/* Checkmark circle */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="7" cy="7" r="6.5" stroke="#10B981" strokeWidth="1" />
              <path
                d="M4.5 7L6.2 8.7L9.5 5.3"
                stroke="#10B981"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Pronto
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function RegisterScreen() {
  const identifyMethod = useKioskStore((s) => s.identifyMethod);
  const inputValue = useKioskStore((s) => s.inputValue);
  const registerName = useKioskStore((s) => s.registerName);
  const registerCpf = useKioskStore((s) => s.registerCpf);
  const registerPhone = useKioskStore((s) => s.registerPhone);
  const setRegisterName = useKioskStore((s) => s.setRegisterName);
  const setRegisterCpf = useKioskStore((s) => s.setRegisterCpf);
  const setRegisterPhone = useKioskStore((s) => s.setRegisterPhone);
  const clientRegistered = useKioskStore((s) => s.clientRegistered);
  const reset = useKioskStore((s) => s.reset);

  const [formStep, setFormStep] = useState<FormStep>(0);
  // +1 = forward, -1 = backward
  const [direction, setDirection] = useState<number>(1);

  // Pre-fill CPF or phone from identification flow on mount
  useEffect(() => {
    if (identifyMethod === "cpf" && inputValue.length > 0) {
      setRegisterCpf(inputValue);
    } else if (identifyMethod === "phone" && inputValue.length > 0) {
      setRegisterPhone(inputValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // Derived validity
  // ---------------------------------------------------------------------------

  const stepValid: Record<FormStep, boolean> = {
    0: isNameValid(registerName),
    1: isCpfValid(registerCpf),
    2: isPhoneValid(registerPhone),
  };

  const isLastStep = formStep === 2;
  const currentStepValid = stepValid[formStep];

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  function goNext() {
    if (formStep < 2) {
      setDirection(1);
      setFormStep((prev) => (prev + 1) as FormStep);
    }
  }

  function goPrev() {
    if (formStep > 0) {
      setDirection(-1);
      setFormStep((prev) => (prev - 1) as FormStep);
    }
  }

  function handleRegister() {
    clientRegistered({
      id: "new-" + Date.now(),
      name: registerName,
      cpf: registerCpf || null,
      phone: registerPhone || null,
      balance_charmes: 0,
    });
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <ScreenLayout
      title="Novo Cadastro"
      subtitle="Preencha seus dados para continuar"
      currentStep={1}
      totalSteps={4}
      stepLabels={["Identificação", "Serviço", "Confirmação", "Concluído"]}
      backAction={reset}
      primaryAction={{
        label: isLastStep ? "Cadastrar" : "Próximo",
        onClick: isLastStep ? handleRegister : goNext,
        disabled: !currentStepValid,
      }}
      secondaryAction={
        formStep > 0
          ? { label: "Voltar", onClick: goPrev }
          : undefined
      }
    >
      <div className="flex flex-col h-full">
        {/* ---------------------------------------------------------------- */}
        {/* Sub-stepper (internal form progress: Nome → CPF → Telefone)      */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex justify-center pt-1 pb-4">
          <StepIndicator currentStep={formStep} />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Animated form step area                                           */}
        {/* ---------------------------------------------------------------- */}
        <div className="relative flex-1 overflow-hidden min-h-0">
          <AnimatePresence mode="wait" custom={direction}>
            {/* ---- Step 0: Name ---- */}
            {formStep === 0 && (
              <motion.div
                key="step-name"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 flex flex-col gap-4"
              >
                <FieldLabel label="Nome completo" isValid={stepValid[0]} />
                <QwertyKeyboard
                  value={registerName}
                  onChange={setRegisterName}
                />
              </motion.div>
            )}

            {/* ---- Step 1: CPF ---- */}
            {formStep === 1 && (
              <motion.div
                key="step-cpf"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 flex flex-col gap-4 items-center"
              >
                <FieldLabel label="CPF" isValid={stepValid[1]} />
                <NumericKeypad
                  value={registerCpf}
                  onChange={setRegisterCpf}
                  mask="cpf"
                  maxLength={11}
                />
              </motion.div>
            )}

            {/* ---- Step 2: Phone ---- */}
            {formStep === 2 && (
              <motion.div
                key="step-phone"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 flex flex-col gap-4 items-center"
              >
                <FieldLabel label="Telefone" isValid={stepValid[2]} />
                <NumericKeypad
                  value={registerPhone}
                  onChange={setRegisterPhone}
                  mask="phone"
                  maxLength={11}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ScreenLayout>
  );
}
