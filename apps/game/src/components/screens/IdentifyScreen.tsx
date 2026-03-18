"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, DeviceMobileCamera } from "@phosphor-icons/react";
import NumericKeypad from "@/components/kiosk/NumericKeypad";
import { useGameStore } from "@/store/game-store";
import { lookupClient, registerClient } from "@/lib/queries/clients";

import type { IdentifyMethod } from "@cheia/types";

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
// Method card
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
      className="glass-strong flex flex-col items-center justify-center gap-6 w-full min-h-[360px] p-10 rounded-[28px] border border-white/60 transition-all duration-200 cursor-pointer active:border-primary/30"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <div
        className="flex items-center justify-center w-28 h-28 rounded-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(217,75,140,0.15) 0%, rgba(194,24,91,0.10) 100%)",
        }}
      >
        <span className="text-primary">{icon}</span>
      </div>
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
// Component
// ---------------------------------------------------------------------------

export default function IdentifyScreen() {
  const setStep = useGameStore((s) => s.setStep);
  const setClient = useGameStore((s) => s.setClient);
  const reset = useGameStore((s) => s.reset);

  const [method, setMethod] = useState<IdentifyMethod | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);
  const [registerName, setRegisterName] = useState("");

  const isValid = method !== null ? isInputValid(inputValue, method) : false;

  async function handleConfirm() {
    if (!isValid || !method) return;
    setLoading(true);
    setNotFound(false);

    const result = await lookupClient(inputValue, method);

    if (result) {
      setClient(result);
      setStep("payment");
    } else {
      // In dev mode without Supabase, create a mock client
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        setClient({
          id: "mock-" + Date.now(),
          name: "Cliente Teste",
          phone: method === "phone" ? inputValue : null,
          cpf: method === "cpf" ? inputValue : null,
          balance_charmes: 150,
        });
        setStep("payment");
      } else {
        setNotFound(true);
        setRegisterMode(true);
      }
    }
    setLoading(false);
  }

  async function handleRegister() {
    if (!registerName.trim()) return;
    setLoading(true);

    const client = await registerClient({
      name: registerName,
      cpf: method === "cpf" ? inputValue : null,
      phone: method === "phone" ? inputValue : null,
    });

    setClient(client);
    setStep("payment");
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center w-full h-screen gradient-mesh overflow-hidden">
      {/* Header */}
      <div className="w-full px-[60px] pt-12 pb-6 flex items-center justify-between">
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            reset();
          }}
          className="glass flex items-center justify-center min-h-[64px] px-8 rounded-full border border-glass-border font-body font-medium text-[24px] text-brand-text-muted active:scale-[0.98] transition-transform"
        >
          ← Voltar
        </button>
        <h2 className="font-display text-[42px] font-bold text-brand-text">
          Identificação
        </h2>
        <div style={{ width: 120 }} />
      </div>

      {/* Content */}
      <div className="flex-1 w-full px-[60px] flex flex-col items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {registerMode ? (
            <motion.div
              key="register"
              variants={fadeSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={fadeSlideTransition}
              className="flex flex-col items-center gap-8 w-full max-w-[720px]"
            >
              <p className="font-body text-[28px] text-brand-text text-center">
                Cliente não encontrado. Cadastre-se:
              </p>
              <div className="glass-strong w-full rounded-[20px] min-h-[96px] px-8 flex items-center">
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full text-[36px] font-body text-brand-text bg-transparent outline-none text-center placeholder:text-brand-text-muted/40"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleRegister();
                }}
                disabled={!registerName.trim() || loading}
                className="w-full flex items-center justify-center min-h-[100px] rounded-[22px] text-[30px] font-semibold font-body text-white active:scale-[0.98] transition-all disabled:opacity-40"
                style={{
                  background: "linear-gradient(to right, #C2185B, #D94B8C)",
                }}
              >
                {loading ? "Cadastrando..." : "Cadastrar e Continuar"}
              </button>
            </motion.div>
          ) : method === null ? (
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
                Identifique-se para jogar
              </p>
              <div className="grid grid-cols-2 gap-6 w-full">
                <MethodCard
                  icon={<CreditCard size={52} weight="light" />}
                  title="CPF"
                  subtitle="Digite seu CPF"
                  onSelect={() => setMethod("cpf")}
                />
                <MethodCard
                  icon={<DeviceMobileCamera size={52} weight="light" />}
                  title="Telefone"
                  subtitle="Digite seu número"
                  onSelect={() => setMethod("phone")}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`keypad-${method}`}
              variants={fadeSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={fadeSlideTransition}
              className="flex flex-col items-center gap-8 w-full"
            >
              {/* Method badge + change */}
              <div className="flex items-center gap-3">
                <div className="glass flex items-center gap-2 px-5 py-3 rounded-full border border-glass-border">
                  <span className="text-primary">
                    {method === "cpf" ? (
                      <CreditCard size={20} weight="light" />
                    ) : (
                      <DeviceMobileCamera size={20} weight="light" />
                    )}
                  </span>
                  <span className="font-body font-semibold text-[24px] text-brand-text">
                    {method === "cpf" ? "CPF" : "Telefone"}
                  </span>
                </div>
                <motion.button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setMethod(null);
                    setInputValue("");
                    setNotFound(false);
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="glass flex items-center justify-center min-h-[64px] px-8 rounded-full border border-glass-border font-body font-medium text-[24px] text-brand-text-muted"
                >
                  Mudar
                </motion.button>
              </div>

              {notFound && (
                <p className="font-body text-[22px] text-error text-center">
                  Cliente não encontrado
                </p>
              )}

              {/* Keypad */}
              <div className="w-full max-w-[720px]">
                <NumericKeypad
                  value={inputValue}
                  onChange={setInputValue}
                  mask={method}
                  maxLength={11}
                />
              </div>

              {/* Confirm */}
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleConfirm();
                }}
                disabled={!isValid || loading}
                className="w-full max-w-[720px] flex items-center justify-center min-h-[100px] rounded-[22px] text-[30px] font-semibold font-body text-white active:scale-[0.98] transition-all disabled:opacity-40"
                style={{
                  background: "linear-gradient(to right, #C2185B, #D94B8C)",
                }}
              >
                {loading ? "Buscando..." : "Confirmar"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
