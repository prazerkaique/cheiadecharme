"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Ticket, ScanLine, Keyboard } from "lucide-react";
import { useProfessionalStore } from "@/store/professional-store";
import { Avatar } from "@/components/ui/Avatar";
import { formatTimeFromIso, formatDuration } from "@/lib/format";

const ease = [0.22, 1, 0.36, 1] as const;

type Mode = "manual" | "qr";

function QrScanner({ onScan }: { onScan: (code: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        // 2 = SCANNING
        if (state === 2) {
          await scannerRef.current.stop();
        }
      } catch {
        // ignore
      }
      scannerRef.current = null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function start() {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (!mounted || !containerRef.current) return;

      const scanner = new Html5Qrcode(containerRef.current.id);
      scannerRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (text) => {
            if (mounted) onScan(text);
          },
          () => {},
        );
      } catch {
        if (mounted) setError("Nao foi possivel acessar a camera");
      }
    }

    start();
    return () => {
      mounted = false;
      stopScanner();
    };
  }, [onScan, stopScanner]);

  if (error) {
    return (
      <div className="glass rounded-[var(--radius-lg)] p-6 text-center">
        <p className="text-[var(--text-body)] text-brand-text-muted">{error}</p>
      </div>
    );
  }

  return (
    <div
      id="qr-reader"
      ref={containerRef}
      className="overflow-hidden rounded-[var(--radius-lg)] bg-black/5"
    />
  );
}

export function TicketScreen() {
  const selectedSlotId = useProfessionalStore((s) => s.selectedSlotId);
  const schedule = useProfessionalStore((s) => s.schedule);
  const ticketInput = useProfessionalStore((s) => s.ticketInput);
  const ticketError = useProfessionalStore((s) => s.ticketError);
  const setTicketInput = useProfessionalStore((s) => s.setTicketInput);
  const submitTicket = useProfessionalStore((s) => s.submitTicket);
  const goToHome = useProfessionalStore((s) => s.goToHome);

  const [mode, setMode] = useState<Mode>("manual");
  const slot = schedule.find((s) => s.id === selectedSlotId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitTicket();
  };

  const handleQrScan = useCallback(
    (code: string) => {
      setTicketInput(code);
      setMode("manual");
      // Auto-submit after short delay so user sees the value
      setTimeout(() => {
        useProfessionalStore.getState().submitTicket();
      }, 300);
    },
    [setTicketInput],
  );

  return (
    <div className="mx-auto max-w-[var(--pro-max-w)] px-4 py-6">
      {/* Back button */}
      <button
        onClick={goToHome}
        className="mb-6 flex items-center gap-2 text-[var(--text-body)] font-semibold text-brand-text-muted transition hover:text-brand-text"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cta/10">
          <Ticket size={24} className="text-cta" />
        </div>
        <h1 className="font-display text-[var(--text-title)] font-bold text-brand-text">
          Validar Ticket
        </h1>
      </div>

      {/* Client context */}
      {slot && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease }}
          className="glass rounded-[var(--radius-lg)] p-4 mb-6 flex items-center gap-3"
        >
          <Avatar name={slot.client_name} size="lg" />
          <div>
            <p className="text-[var(--text-body)] font-semibold text-brand-text">
              {slot.client_name}
            </p>
            <p className="text-[var(--text-small)] text-brand-text-muted">
              {slot.service_name} — {formatDuration(slot.duration_minutes)}
            </p>
            <p className="text-[var(--text-small)] text-brand-text-muted">
              Agendado: {formatTimeFromIso(slot.scheduled_at)}
            </p>
          </div>
        </motion.div>
      )}

      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("manual")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-[var(--radius-md)] py-3 text-[var(--text-small)] font-bold transition ${
            mode === "manual"
              ? "bg-cta text-white"
              : "glass text-brand-text-muted"
          }`}
        >
          <Keyboard size={16} />
          Digitar
        </button>
        <button
          onClick={() => setMode("qr")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-[var(--radius-md)] py-3 text-[var(--text-small)] font-bold transition ${
            mode === "qr"
              ? "bg-cta text-white"
              : "glass text-brand-text-muted"
          }`}
        >
          <ScanLine size={16} />
          QR Code
        </button>
      </div>

      {/* Content by mode */}
      {mode === "qr" ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease }}
        >
          <QrScanner onScan={handleQrScan} />
          <p className="mt-3 text-center text-[var(--text-small)] text-brand-text-muted">
            Aponte a camera para o QR Code do ticket
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease, delay: 0.1 }}
          >
            <label className="block text-[var(--text-small)] font-bold uppercase tracking-wide text-brand-text-muted mb-2">
              Numero do ticket
            </label>
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder="CCC-XXX"
              autoFocus
              className={[
                "glass-strong h-16 w-full rounded-[var(--radius-lg)] px-6 text-center font-display text-[var(--text-title)] font-bold tracking-widest text-brand-text placeholder:text-brand-text-muted/40 focus:outline-none focus:ring-2",
                ticketError ? "ring-2 ring-red-400/60 focus:ring-red-400/60" : "focus:ring-cta/30",
              ].join(" ")}
            />
            {ticketError && (
              <p className="mt-2 text-center text-[var(--text-small)] font-semibold text-red-500">
                {ticketError}
              </p>
            )}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease, delay: 0.2 }}
            type="submit"
            disabled={!ticketInput.trim()}
            className="w-full rounded-[var(--radius-md)] bg-cta py-4 text-[var(--text-body)] font-bold text-white transition hover:bg-cta-soft glow-cta disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirmar
          </motion.button>
        </form>
      )}
    </div>
  );
}
