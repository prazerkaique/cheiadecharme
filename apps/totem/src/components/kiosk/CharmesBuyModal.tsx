"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { QrCode, CreditCard, PencilLine, ContactlessPayment } from "@phosphor-icons/react";
import QRCodeDisplay from "@/components/kiosk/QRCodeDisplay";
import { formatCharmes } from "@/lib/format";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CharmesBuyModalProps {
  deficit?: number;
  onClose: () => void;
}

type BuyStep = "select" | "pix" | "card";

export interface PackOption {
  charmes: number;
  priceReais: number;
  discountLabel?: string;
  highlight?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function buildDeficitPacks(deficit: number): PackOption[] {
  const exact = Math.ceil(deficit / 10) * 10 || 10;
  const double = Math.ceil((deficit * 2) / 10) * 10;
  const quad = Math.ceil((deficit * 4) / 10) * 10;

  return [
    { charmes: exact, priceReais: exact },
    { charmes: double, priceReais: Math.round(double * 0.9), discountLabel: "10% OFF" },
    { charmes: quad, priceReais: Math.round(quad * 0.85), discountLabel: "15% OFF · Melhor valor", highlight: true },
  ];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PACK_OPTIONS: PackOption[] = [
  { charmes: 50, priceReais: 50 },
  { charmes: 100, priceReais: 100 },
  { charmes: 200, priceReais: 200 },
  { charmes: 500, priceReais: 500 },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.22, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: { duration: 0.20, ease: "easeIn" as const },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBRL(value: number): string {
  return `R$${value}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CharmesBuyModal({ deficit, onClose }: CharmesBuyModalProps) {
  const [step, setStep] = useState<BuyStep>("select");
  const [selectedPack, setSelectedPack] = useState<PackOption | null>(null);

  function handleBack() {
    if (step === "select") {
      onClose();
    } else {
      setStep("select");
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="timeout-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-label="Comprar Charmes"
      >
        <motion.div
          className="glass-strong w-full flex flex-col items-center gap-7 mx-6"
          style={{
            maxWidth: "680px",
            borderRadius: "32px",
            padding: "48px 40px",
          }}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {step === "select" && (
            <SelectStep
              deficit={deficit}
              selectedPack={selectedPack}
              onSelectPack={setSelectedPack}
              onPix={() => setStep("pix")}
              onCard={() => setStep("card")}
              onBack={handleBack}
            />
          )}

          {step === "pix" && selectedPack && (
            <PixStep pack={selectedPack} onBack={() => setStep("select")} />
          )}

          {step === "card" && selectedPack && (
            <CardStep pack={selectedPack} onBack={() => setStep("select")} />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// SelectStep
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Custom amount constants
// ---------------------------------------------------------------------------

const MIN_CUSTOM_CHARMES = 10;
const MAX_CUSTOM_CHARMES = 9999;

// ---------------------------------------------------------------------------
// SelectStep
// ---------------------------------------------------------------------------

function SelectStep({
  deficit,
  selectedPack,
  onSelectPack,
  onPix,
  onCard,
  onBack,
}: {
  deficit?: number;
  selectedPack: PackOption | null;
  onSelectPack: (pack: PackOption) => void;
  onPix: () => void;
  onCard: () => void;
  onBack: () => void;
}) {
  const [showCustom, setShowCustom] = useState(false);
  const [customDigits, setCustomDigits] = useState("");

  const customAmount = parseInt(customDigits || "0", 10);
  const customValid = customAmount >= MIN_CUSTOM_CHARMES && customAmount <= MAX_CUSTOM_CHARMES;

  function handleCustomDigit(digit: string) {
    const next = customDigits + digit;
    if (parseInt(next, 10) > MAX_CUSTOM_CHARMES) return;
    setCustomDigits(next);
  }

  function handleCustomBackspace() {
    setCustomDigits((d) => d.slice(0, -1));
  }

  function handleCustomConfirm() {
    if (!customValid) return;
    onSelectPack({ charmes: customAmount, priceReais: customAmount });
    setShowCustom(false);
  }

  const hasSelection = selectedPack !== null;
  const packs = deficit ? buildDeficitPacks(deficit) : PACK_OPTIONS;

  // -- Custom amount input view -----------------------------------------------
  if (showCustom) {
    return (
      <>
        <h2
          className="font-display text-brand-text text-center leading-tight"
          style={{ fontSize: "40px", letterSpacing: "-0.01em" }}
        >
          Outro Valor ✦
        </h2>

        <p className="text-[26px] font-body text-brand-text-muted text-center">
          Digite quantos Charmes deseja (mín. {MIN_CUSTOM_CHARMES})
        </p>

        {/* Amount display */}
        <div className="glass-strong relative w-full rounded-[20px] min-h-[96px] px-8 flex items-center justify-center overflow-hidden">
          {customDigits.length > 0 ? (
            <span className="text-[48px] font-semibold font-body tracking-[0.04em] text-brand-text">
              {formatCharmes(customAmount)}{" "}
              <span className="text-[28px] text-brand-text-muted font-normal">
                = {formatBRL(customAmount)}
              </span>
            </span>
          ) : (
            <span
              className="text-[48px] font-body tracking-[0.04em]"
              style={{ color: "rgba(74,13,46,0.30)" }}
            >
              0 ✦
            </span>
          )}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{
              background:
                "linear-gradient(to right, rgba(217,75,140,0.30), rgba(194,24,91,0.30), rgba(217,75,140,0.30))",
            }}
          />
        </div>

        {/* Compact keypad */}
        <div className="w-full grid grid-cols-3 gap-3">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
            <button
              key={d}
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                handleCustomDigit(d);
              }}
              className="glass-key flex items-center justify-center w-full rounded-[16px] select-none font-body"
              style={{ minHeight: "90px", WebkitTapHighlightColor: "transparent" }}
            >
              <span className="text-[44px] font-semibold text-brand-text">{d}</span>
            </button>
          ))}

          {/* Row 4: Clear / 0 / Backspace */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              setCustomDigits("");
            }}
            disabled={customDigits.length === 0}
            className={[
              "glass-key flex items-center justify-center w-full rounded-[16px] select-none font-body",
              customDigits.length === 0 ? "opacity-30 pointer-events-none" : "",
            ].join(" ")}
            style={{ minHeight: "90px", backgroundColor: "rgba(217,75,140,0.06)", WebkitTapHighlightColor: "transparent" }}
          >
            <span className="text-[24px] font-semibold text-brand-text">Limpar</span>
          </button>

          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              handleCustomDigit("0");
            }}
            className="glass-key flex items-center justify-center w-full rounded-[16px] select-none font-body"
            style={{ minHeight: "90px", WebkitTapHighlightColor: "transparent" }}
          >
            <span className="text-[44px] font-semibold text-brand-text">0</span>
          </button>

          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              handleCustomBackspace();
            }}
            disabled={customDigits.length === 0}
            className={[
              "glass-key flex items-center justify-center w-full rounded-[16px] select-none font-body",
              customDigits.length === 0 ? "opacity-30 pointer-events-none" : "",
            ].join(" ")}
            style={{ minHeight: "90px", backgroundColor: "rgba(217,75,140,0.06)", WebkitTapHighlightColor: "transparent" }}
          >
            <span className="text-[28px] font-semibold text-brand-text">&#9003;</span>
          </button>
        </div>

        {/* Confirm custom */}
        <button
          type="button"
          disabled={!customValid}
          onPointerDown={(e) => {
            if (!customValid) return;
            e.preventDefault();
            handleCustomConfirm();
          }}
          className={[
            "w-full flex items-center justify-center gap-3 font-body font-semibold tracking-wide active:scale-[0.98] transition-all duration-150",
            customValid
              ? "glow-cta ring-1 ring-white/20 text-white"
              : "opacity-40 text-white cursor-not-allowed",
          ].join(" ")}
          style={{
            minHeight: "90px",
            borderRadius: "22px",
            fontSize: "28px",
            background: "linear-gradient(to right, #C2185B, #D94B8C)",
          }}
        >
          Selecionar {customValid ? formatCharmes(customAmount) : ""}
        </button>

        {/* Back */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            setShowCustom(false);
          }}
          className="text-[24px] font-body font-medium text-cta underline underline-offset-4 active:opacity-70 transition-opacity py-2"
        >
          Voltar aos pacotes
        </button>
      </>
    );
  }

  // -- Normal pack selection view ---------------------------------------------
  return (
    <>
      {/* Title */}
      <h2
        className="font-display text-brand-text text-center leading-tight"
        style={{ fontSize: "40px", letterSpacing: "-0.01em" }}
      >
        {deficit ? "Saldo Insuficiente" : "Comprar Charmes ✦"}
      </h2>

      {/* Subtitle */}
      <p className="text-[26px] font-body text-brand-text-muted text-center">
        {deficit
          ? `Faltam ${formatCharmes(deficit)} para completar`
          : "Selecione o valor:"}
      </p>

      {/* Deficit mode → vertical list | Normal mode → grid 2x2 */}
      {deficit ? (
        <div className="w-full flex flex-col gap-4">
          {packs.map((pack) => {
            const isSelected = selectedPack?.charmes === pack.charmes;
            return (
              <button
                key={pack.charmes}
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  onSelectPack(pack);
                }}
                className={[
                  "w-full flex items-center justify-between px-7 rounded-[20px] active:scale-[0.97] transition-all duration-150",
                  isSelected
                    ? "glass-strong border-2 border-cta/40 shadow-lg"
                    : "glass border border-white/60",
                  pack.highlight ? "ring-1 ring-cta/20" : "",
                ].join(" ")}
                style={{ minHeight: "100px", WebkitTapHighlightColor: "transparent" }}
              >
                <div className="flex flex-col items-start gap-1">
                  <span
                    className={[
                      "text-[30px] font-body font-bold leading-none",
                      isSelected ? "text-cta" : "text-brand-text",
                    ].join(" ")}
                  >
                    {formatCharmes(pack.charmes)}
                  </span>
                  {pack.discountLabel && (
                    <span
                      className={[
                        "text-[20px] font-body font-semibold leading-none px-2 py-1 rounded-full",
                        pack.highlight
                          ? "bg-green-100 text-green-700"
                          : "bg-green-50 text-green-600",
                      ].join(" ")}
                    >
                      {pack.discountLabel}
                    </span>
                  )}
                  {!pack.discountLabel && (
                    <span className="text-[20px] font-body text-brand-text-muted leading-none">
                      Valor exato
                    </span>
                  )}
                </div>
                <span
                  className={[
                    "text-[28px] font-body font-semibold leading-none",
                    isSelected ? "text-cta/80" : "text-brand-text-muted",
                  ].join(" ")}
                >
                  {formatBRL(pack.priceReais)}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="w-full grid grid-cols-2 gap-4">
          {packs.map((pack) => {
            const isSelected = selectedPack?.charmes === pack.charmes;
            return (
              <button
                key={pack.charmes}
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  onSelectPack(pack);
                }}
                className={[
                  "flex flex-col items-center justify-center gap-2 rounded-[20px] py-6 active:scale-[0.97] transition-all duration-150",
                  isSelected
                    ? "glass-strong border-2 border-cta/40 shadow-lg"
                    : "glass border border-white/60",
                ].join(" ")}
                style={{ minHeight: "120px", WebkitTapHighlightColor: "transparent" }}
              >
                <span
                  className={[
                    "text-[32px] font-body font-bold leading-none",
                    isSelected ? "text-cta" : "text-brand-text",
                  ].join(" ")}
                >
                  {formatCharmes(pack.charmes)}
                </span>
                <span
                  className={[
                    "text-[24px] font-body leading-none",
                    isSelected ? "text-cta/80" : "text-brand-text-muted",
                  ].join(" ")}
                >
                  {formatBRL(pack.priceReais)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Custom amount button */}
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          setShowCustom(true);
        }}
        className="w-full flex items-center justify-center gap-3 glass border border-brand-border/60 font-body font-medium active:scale-[0.97] transition-all duration-150"
        style={{
          minHeight: "80px",
          borderRadius: "20px",
          fontSize: "26px",
          color: "var(--color-brand-text)",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <PencilLine size={28} weight="light" />
        Outro valor
      </button>

      {/* Payment method label */}
      {hasSelection && (
        <p className="text-[26px] font-body text-brand-text-muted text-center">
          Como deseja pagar?
        </p>
      )}

      {/* Pix CTA */}
      <button
        type="button"
        disabled={!hasSelection}
        onPointerDown={(e) => {
          if (!hasSelection) return;
          e.preventDefault();
          onPix();
        }}
        className={[
          "w-full flex items-center justify-center gap-3 font-body font-semibold tracking-wide active:scale-[0.98] transition-all duration-150",
          hasSelection
            ? "glow-cta ring-1 ring-white/20 text-white"
            : "opacity-40 text-white cursor-not-allowed",
        ].join(" ")}
        style={{
          minHeight: "100px",
          borderRadius: "22px",
          fontSize: "30px",
          background: "linear-gradient(to right, #C2185B, #D94B8C)",
        }}
      >
        <QrCode size={34} weight="light" />
        Pagar com Pix
      </button>

      {/* Card secondary */}
      <button
        type="button"
        disabled={!hasSelection}
        onPointerDown={(e) => {
          if (!hasSelection) return;
          e.preventDefault();
          onCard();
        }}
        className={[
          "w-full flex items-center justify-center gap-3 glass-strong border border-brand-border font-body font-medium active:scale-[0.98] transition-all duration-150",
          !hasSelection && "opacity-40 cursor-not-allowed",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          minHeight: "90px",
          borderRadius: "22px",
          fontSize: "26px",
          color: "var(--color-brand-text)",
        }}
      >
        <CreditCard size={30} weight="light" />
        Cartão de Crédito
      </button>

      {/* Back link */}
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          onBack();
        }}
        className="text-[24px] font-body font-medium text-cta underline underline-offset-4 active:opacity-70 transition-opacity py-2"
      >
        Voltar
      </button>
    </>
  );
}

// ---------------------------------------------------------------------------
// PixStep
// ---------------------------------------------------------------------------

function PixStep({ pack, onBack }: { pack: PackOption; onBack: () => void }) {
  const mockPixPayload = `00020126580014br.gov.bcb.pix0136mock-${pack.charmes}-charmes-${Date.now()}`;

  return (
    <>
      <h2
        className="font-display text-brand-text text-center leading-tight"
        style={{ fontSize: "36px", letterSpacing: "-0.01em" }}
      >
        Pagar com Pix
      </h2>

      <p className="text-[26px] font-body text-brand-text-muted text-center">
        {formatCharmes(pack.charmes)} por {formatBRL(pack.priceReais)}
      </p>

      {/* QR Code */}
      <div className="flex justify-center">
        <QRCodeDisplay value={mockPixPayload} size={260} />
      </div>

      {/* Awaiting payment */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-cta animate-pulse" />
        <span className="text-[24px] font-body font-medium text-brand-text-muted">
          Aguardando pagamento...
        </span>
      </div>

      {/* Back */}
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          onBack();
        }}
        className="w-full flex items-center justify-center glass-strong border border-brand-border text-brand-text font-body font-medium active:scale-[0.98] transition-all duration-150"
        style={{
          minHeight: "80px",
          borderRadius: "22px",
          fontSize: "26px",
        }}
      >
        Voltar
      </button>
    </>
  );
}

// ---------------------------------------------------------------------------
// CardStep
// ---------------------------------------------------------------------------

function CardStep({ pack, onBack }: { pack: PackOption; onBack: () => void }) {
  return (
    <>
      <h2
        className="font-display text-brand-text text-center leading-tight"
        style={{ fontSize: "36px", letterSpacing: "-0.01em" }}
      >
        Cartão de Crédito
      </h2>

      <p className="text-[26px] font-body text-brand-text-muted text-center">
        {formatCharmes(pack.charmes)} por {formatBRL(pack.priceReais)}
      </p>

      {/* Card icon placeholder */}
      <div
        className="w-full flex flex-col items-center justify-center gap-5 py-12 rounded-[20px]"
        style={{
          background: "linear-gradient(135deg, rgba(194,24,91,0.06), rgba(217,75,140,0.10))",
          border: "1.5px solid rgba(194,24,91,0.12)",
        }}
      >
        <ContactlessPayment size={64} weight="light" className="text-brand-text" />
        <p className="text-[28px] font-body font-semibold text-brand-text text-center leading-snug px-6">
          Aproxime ou insira o cartão na maquininha
        </p>
      </div>

      {/* Awaiting payment */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-cta animate-pulse" />
        <span className="text-[24px] font-body font-medium text-brand-text-muted">
          Aguardando pagamento...
        </span>
      </div>

      {/* Back */}
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          onBack();
        }}
        className="w-full flex items-center justify-center glass-strong border border-brand-border text-brand-text font-body font-medium active:scale-[0.98] transition-all duration-150"
        style={{
          minHeight: "80px",
          borderRadius: "22px",
          fontSize: "26px",
        }}
      >
        Voltar
      </button>
    </>
  );
}
