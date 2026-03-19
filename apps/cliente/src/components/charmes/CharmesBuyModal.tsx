"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, QrCode, Check } from "lucide-react";
import { useClientStore } from "@/store/client-store";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const ease = [0.22, 1, 0.36, 1] as const;

type BuyStep = "select" | "pix";

interface PackOption {
  charmes: number;
  priceReais: number;
}

const PACK_OPTIONS: PackOption[] = [
  { charmes: 50, priceReais: 50 },
  { charmes: 100, priceReais: 100 },
  { charmes: 200, priceReais: 200 },
  { charmes: 500, priceReais: 500 },
];

interface CharmesBuyModalProps {
  onClose: () => void;
}

export function CharmesBuyModal({ onClose }: CharmesBuyModalProps) {
  const [step, setStep] = useState<BuyStep>("select");
  const [selectedPack, setSelectedPack] = useState<PackOption | null>(null);
  const [paying, setPaying] = useState(false);
  const addCharmes = useClientStore((s) => s.addCharmes);

  const handlePay = async () => {
    if (!selectedPack) return;
    setPaying(true);
    await addCharmes(selectedPack.charmes);
    setPaying(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          className="w-full max-w-lg bg-white rounded-t-3xl shadow-xl"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.35, ease }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="text-lg font-display font-bold text-brand-text">
              {step === "select" ? "Comprar Charmes" : "Pagar com Pix"}
            </h2>
            <button
              onPointerDown={(e) => { e.preventDefault(); onClose(); }}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary/30 transition-colors"
            >
              <X className="w-5 h-5 text-brand-text-muted" />
            </button>
          </div>

          <div className="px-5 pb-6">
            {step === "select" && (
              <div className="space-y-3">
                <p className="text-sm text-brand-text-muted mb-4">
                  Selecione o pacote de charmes:
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {PACK_OPTIONS.map((pack) => {
                    const isSelected = selectedPack?.charmes === pack.charmes;
                    return (
                      <button
                        key={pack.charmes}
                        onPointerDown={(e) => { e.preventDefault(); setSelectedPack(pack); }}
                        className={`flex flex-col items-center justify-center gap-1.5 rounded-xl py-5 transition-all ${
                          isSelected
                            ? "bg-cta/10 border-2 border-cta/40 shadow-sm"
                            : "glass-strong border border-transparent"
                        }`}
                      >
                        <span className={`text-2xl font-bold ${isSelected ? "text-cta" : "text-brand-text"}`}>
                          {pack.charmes}
                        </span>
                        <span className={`text-sm ${isSelected ? "text-cta/80" : "text-brand-text-muted"}`}>
                          R${pack.priceReais}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={!selectedPack}
                  onPointerDown={(e) => { e.preventDefault(); if (selectedPack) setStep("pix"); }}
                  className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-cta to-primary text-white font-display font-semibold text-base disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                >
                  <QrCode className="w-5 h-5" />
                  Pagar com Pix
                </button>
              </div>
            )}

            {step === "pix" && selectedPack && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-brand-text-muted">
                    {selectedPack.charmes} charmes por R${selectedPack.priceReais}
                  </p>
                </div>

                {/* Mock QR code */}
                <div className="flex justify-center py-4">
                  <div className="w-48 h-48 rounded-2xl bg-white border-2 border-brand-border flex items-center justify-center">
                    <div className="grid grid-cols-5 gap-1">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-7 h-7 rounded-sm ${
                            [0, 1, 2, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 23, 24].includes(i)
                              ? "bg-brand-text"
                              : "bg-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cta animate-pulse" />
                  <span className="text-sm font-medium text-brand-text-muted">
                    Aguardando pagamento...
                  </span>
                </div>

                {/* Simulate payment */}
                <button
                  disabled={paying}
                  onPointerDown={(e) => { e.preventDefault(); handlePay(); }}
                  className="w-full py-3.5 rounded-xl text-white font-display font-semibold text-base disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(to right, #16a34a, #22c55e)" }}
                >
                  {paying ? (
                    <LoadingSpinner size={20} />
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Simular Pix Pago
                    </>
                  )}
                </button>

                <button
                  onPointerDown={(e) => { e.preventDefault(); setStep("select"); }}
                  className="w-full py-3 rounded-xl glass-strong border border-brand-border text-brand-text font-semibold text-sm transition-all"
                >
                  Voltar
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
