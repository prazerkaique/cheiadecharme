"use client";

import { useEffect, useState } from "react";
import * as QRCode from "qrcode";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

type QRState =
  | { status: "loading" }
  | { status: "ready"; dataUrl: string }
  | { status: "error"; message: string };

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function QRCodeDisplay({ value, size = 240 }: QRCodeDisplayProps) {
  const [state, setState] = useState<QRState>({ status: "loading" });

  useEffect(() => {
    if (!value) {
      setState({ status: "error", message: "Nenhum valor fornecido." });
      return;
    }

    let cancelled = false;

    setState({ status: "loading" });

    QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      color: {
        dark: "#831843",  // brand-text
        light: "#FFFFFF", // surface
      },
      errorCorrectionLevel: "M",
    })
      .then((dataUrl) => {
        if (!cancelled) setState({ status: "ready", dataUrl });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            message:
              err instanceof Error ? err.message : "Falha ao gerar QR Code.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [value, size]);

  // Total wrapper size accounts for padding (p-6 = 24px each side)
  const wrapperSize = size + 48;

  return (
    <div
      className="glass-strong rounded-[24px] p-6 flex items-center justify-center"
      style={{ width: wrapperSize, height: wrapperSize }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Loading — gradient shimmer placeholder                              */}
      {/* ------------------------------------------------------------------ */}
      {state.status === "loading" && (
        <div
          className="relative overflow-hidden rounded-[12px]"
          style={{ width: size, height: size }}
        >
          {/* Base tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-cta/8 to-primary/10" />
          {/* Shimmer sweep */}
          <div className="absolute inset-0 shimmer" />
          {/* Animated pulse overlay */}
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-primary/5 to-cta/5 rounded-[12px]" />
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Ready — QR image                                                     */}
      {/* ------------------------------------------------------------------ */}
      {state.status === "ready" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={state.dataUrl}
          alt="QR Code"
          width={size}
          height={size}
          className="rounded-[12px]"
          draggable={false}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Error                                                                */}
      {/* ------------------------------------------------------------------ */}
      {state.status === "error" && (
        <div className="flex flex-col items-center gap-3 px-4 text-center">
          {/* Warning icon — inline SVG, no emoji */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10 text-warning"
            aria-hidden="true"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="text-[14px] font-body text-error leading-snug">
            {state.message}
          </span>
        </div>
      )}
    </div>
  );
}
