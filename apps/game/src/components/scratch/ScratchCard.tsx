"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { Prize } from "@cheia/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CARD_WIDTH = 600;
const CARD_HEIGHT = 400;
const SCRATCH_RADIUS = 28;
const REVEAL_THRESHOLD = 0.45;
const CHECK_INTERVAL = 10;

const PRIZE_BG: Record<string, string> = {
  nothing: "#FDF2F8",
  charmes: "#FDF2F8",
  discount_percent: "#FFF1F2",
  yearly_service: "#FDF2F8",
};

const PRIZE_ACCENT: Record<string, string> = {
  nothing: "#9CA3AF",
  charmes: "#C2185B",
  discount_percent: "#D94B8C",
  yearly_service: "#8B5CF6",
};

// ---------------------------------------------------------------------------
// Draw: Prize Layer
// ---------------------------------------------------------------------------

function drawPrizeLayer(ctx: CanvasRenderingContext2D, prize: Prize) {
  const bg = PRIZE_BG[prize.type] ?? "#FDF2F8";
  const accent = PRIZE_ACCENT[prize.type] ?? "#C2185B";

  const radial = ctx.createRadialGradient(
    CARD_WIDTH / 2, CARD_HEIGHT / 2, 0,
    CARD_WIDTH / 2, CARD_HEIGHT / 2, CARD_WIDTH * 0.6,
  );
  radial.addColorStop(0, "#FFFFFF");
  radial.addColorStop(1, bg);
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  ctx.font = "72px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const emoji =
    prize.type === "nothing" ? "😔"
    : prize.type === "yearly_service" ? "👑"
    : prize.type === "charmes" ? "✨"
    : "🎉";
  ctx.fillText(emoji, CARD_WIDTH / 2, CARD_HEIGHT / 2 - 55);

  ctx.fillStyle = accent;
  ctx.font = "bold 44px 'Plus Jakarta Sans', system-ui, sans-serif";
  ctx.fillText(prize.label, CARD_WIDTH / 2, CARD_HEIGHT / 2 + 35);

  ctx.globalAlpha = 0.6;
  ctx.font = "26px 'Plus Jakarta Sans', system-ui, sans-serif";
  const subtitle =
    prize.type === "nothing" ? "Tente novamente na próxima!"
    : prize.type === "yearly_service" ? "Prêmio máximo! 🎊"
    : "Parabéns!";
  ctx.fillText(subtitle, CARD_WIDTH / 2, CARD_HEIGHT / 2 + 85);
  ctx.globalAlpha = 1;
}

// ---------------------------------------------------------------------------
// Draw: Scratch Layer (metallic pink)
// ---------------------------------------------------------------------------

function drawScratchLayer(ctx: CanvasRenderingContext2D) {
  const base = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
  base.addColorStop(0, "#F9A8D4");
  base.addColorStop(0.2, "#EC4899");
  base.addColorStop(0.4, "#F5B8D3");
  base.addColorStop(0.5, "#FFFFFF");
  base.addColorStop(0.6, "#F5B8D3");
  base.addColorStop(0.8, "#D94B8C");
  base.addColorStop(1, "#C2185B");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Brushed metal streaks
  ctx.globalAlpha = 0.08;
  for (let y = 0; y < CARD_HEIGHT; y += 2) {
    ctx.fillStyle = y % 4 === 0 ? "#FFFFFF" : "#000000";
    ctx.fillRect(0, y, CARD_WIDTH, 1);
  }
  ctx.globalAlpha = 1;

  // Diagonal shine strips
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.moveTo(CARD_WIDTH * 0.3, 0);
  ctx.lineTo(CARD_WIDTH * 0.5, 0);
  ctx.lineTo(CARD_WIDTH * 0.2, CARD_HEIGHT);
  ctx.lineTo(0, CARD_HEIGHT);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.moveTo(CARD_WIDTH * 0.55, 0);
  ctx.lineTo(CARD_WIDTH * 0.62, 0);
  ctx.lineTo(CARD_WIDTH * 0.32, CARD_HEIGHT);
  ctx.lineTo(CARD_WIDTH * 0.25, CARD_HEIGHT);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Sparkle dots
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#FFFFFF";
  const sparkles = [
    [120, 80], [480, 60], [300, 320], [530, 280], [80, 300],
    [400, 140], [200, 200], [460, 340], [150, 350], [350, 50],
  ];
  for (const [sx, sy] of sparkles) {
    ctx.beginPath();
    ctx.arc(sx, sy, 2 + Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // "RASPE AQUI" text
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "bold 52px 'Plus Jakarta Sans', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✨ RASPE AQUI ✨", CARD_WIDTH / 2, CARD_HEIGHT / 2);
  ctx.restore();

  // Inner border glow
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(4, 4, CARD_WIDTH - 8, CARD_HEIGHT - 8, 20);
  ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Sampled percentage
// ---------------------------------------------------------------------------

function calculateScratchedPercentage(ctx: CanvasRenderingContext2D): number {
  const imageData = ctx.getImageData(0, 0, CARD_WIDTH, CARD_HEIGHT);
  const pixels = imageData.data;
  let transparent = 0;
  const step = 16;
  let total = 0;
  for (let i = 3; i < pixels.length; i += step) {
    total++;
    if (pixels[i] === 0) transparent++;
  }
  return transparent / total;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ScratchCardProps {
  prize: Prize;
  onReveal: () => void;
}

export default function ScratchCard({ prize, onReveal }: ScratchCardProps) {
  const prizeCanvasRef = useRef<HTMLCanvasElement>(null);
  const scratchCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const hasRevealed = useRef(false);
  const strokeCount = useRef(0);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [revealed, setRevealed] = useState(false);

  // Stable refs for callbacks used in native listeners
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;

  // Draw both layers on mount
  useEffect(() => {
    const prizeCanvas = prizeCanvasRef.current;
    const scratchCanvas = scratchCanvasRef.current;
    if (!prizeCanvas || !scratchCanvas) return;

    const prizeCtx = prizeCanvas.getContext("2d");
    const scratchCtx = scratchCanvas.getContext("2d");
    if (!prizeCtx || !scratchCtx) return;

    drawPrizeLayer(prizeCtx, prize);
    drawScratchLayer(scratchCtx);
  }, [prize]);

  // -----------------------------------------------------------------------
  // Native pointer event listeners (bypass React synthetic events)
  // -----------------------------------------------------------------------
  useEffect(() => {
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;

    function getPoint(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) * (CARD_WIDTH / rect.width),
        y: (e.clientY - rect.top) * (CARD_HEIGHT / rect.height),
      };
    }

    function scratchAt(x: number, y: number) {
      const ctx = canvas!.getContext("2d");
      if (!ctx) return;

      ctx.globalCompositeOperation = "destination-out";

      const prev = lastPoint.current;
      if (prev) {
        ctx.lineWidth = SCRATCH_RADIUS * 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, SCRATCH_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      lastPoint.current = { x, y };
      strokeCount.current++;

      if (strokeCount.current % CHECK_INTERVAL === 0) {
        checkReveal();
      }
    }

    function checkReveal() {
      if (hasRevealed.current) return;
      const ctx = canvas!.getContext("2d");
      if (!ctx) return;

      const pct = calculateScratchedPercentage(ctx);
      if (pct >= REVEAL_THRESHOLD) {
        hasRevealed.current = true;
        setRevealed(true);
        onRevealRef.current();
      }
    }

    function onDown(e: PointerEvent) {
      e.preventDefault();
      if (hasRevealed.current) return;

      canvas!.setPointerCapture(e.pointerId);
      isDrawing.current = true;
      lastPoint.current = null;

      const pt = getPoint(e);
      scratchAt(pt.x, pt.y);
    }

    function onMove(e: PointerEvent) {
      if (!isDrawing.current || hasRevealed.current) return;
      e.preventDefault();
      const pt = getPoint(e);
      scratchAt(pt.x, pt.y);
    }

    function onUp() {
      if (!isDrawing.current) return;
      isDrawing.current = false;
      lastPoint.current = null;
      checkReveal();
    }

    // Block touch default at the earliest possible moment
    function onTouchStart(e: TouchEvent) { e.preventDefault(); }
    function onTouchMove(e: TouchEvent) { e.preventDefault(); }

    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("pointerdown", onDown, { passive: false });
    canvas.addEventListener("pointermove", onMove, { passive: false });
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    return () => {
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [prize]); // re-attach if prize changes (canvas redrawn)

  return (
    <div
      className="relative select-none touch-none"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        maxWidth: "90vw",
        borderRadius: 24,
        overflow: "hidden",
        boxShadow:
          "0 0 40px rgba(236,72,153,0.25), 0 8px 32px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.2)",
      }}
    >
      <canvas
        ref={prizeCanvasRef}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        className="absolute inset-0 w-full h-full"
      />
      <canvas
        ref={scratchCanvasRef}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: revealed ? 0 : 1,
          transition: "opacity 0.6s ease-out",
          cursor: "grab",
          touchAction: "none",
        }}
      />
    </div>
  );
}
