"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { Prize } from "@cheia/types";
import { easeOutExpo } from "@/lib/spin-logic";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WHEEL_SIZE = 805;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2 - 10;
const INNER_RADIUS = 80;
const SPIN_DURATION_MS = 4500;

const LIGHT_COLORS = new Set(["#FFFFFF", "#F5B8D3"]);

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SpinWheelProps {
  prizes: Prize[];
  spinning: boolean;
  targetAngle: number;
  onSpinEnd: () => void;
  logoUrl?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SpinWheel({
  prizes,
  spinning,
  targetAngle,
  onSpinEnd,
  logoUrl,
}: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentAngleRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const startAngleRef = useRef(0);
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);

  // Preload logo image
  useEffect(() => {
    const src = logoUrl || "/logo.png";
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setLogoImg(img);
    img.src = src;
  }, [logoUrl]);

  // Draw the wheel at a given rotation angle
  const drawWheel = useCallback(
    (rotation: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = WHEEL_SIZE * dpr;
      canvas.height = WHEEL_SIZE * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);

      const segmentAngle = (2 * Math.PI) / prizes.length;

      ctx.save();
      ctx.translate(CENTER, CENTER);
      ctx.rotate((rotation * Math.PI) / 180);

      // Draw segments
      for (let i = 0; i < prizes.length; i++) {
        const startAngle = segmentAngle * i - Math.PI / 2;
        const endAngle = startAngle + segmentAngle;

        // Segment fill — use prize color
        const segColor = prizes[i].color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, RADIUS, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = segColor;
        ctx.fill();

        // Segment border
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Text — horizontal, centered between inner circle and edge
        const isLight = LIGHT_COLORS.has(segColor);
        ctx.save();
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = isLight ? "#4A0D2E" : "#FFFFFF";
        ctx.font = "bold 18px Nunito, sans-serif";
        ctx.shadowColor = isLight ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.4)";
        ctx.shadowBlur = isLight ? 0 : 3;

        const label = prizes[i].label;
        const textR = (INNER_RADIUS + RADIUS) / 2;
        if (label.length > 10) {
          const words = label.split(" ");
          const mid = Math.ceil(words.length / 2);
          ctx.fillText(words.slice(0, mid).join(" "), textR, -10);
          ctx.fillText(words.slice(mid).join(" "), textR, 12);
        } else {
          ctx.fillText(label, textR, 0);
        }

        ctx.shadowBlur = 0;
        ctx.restore();
      }

      ctx.restore();

      // Center circle (white with shadow)
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, INNER_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "rgba(74,13,46,0.2)";
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Center border ring
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, INNER_RADIUS, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(217,75,140,0.2)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Center logo (preserve aspect ratio, fill most of center circle)
      if (logoImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(CENTER, CENTER, INNER_RADIUS - 3, 0, 2 * Math.PI);
        ctx.clip();
        const availableSize = (INNER_RADIUS - 3) * 2 * 1.15; // 15% larger than circle
        const imgW = logoImg.naturalWidth;
        const imgH = logoImg.naturalHeight;
        const scale = Math.min(availableSize / imgW, availableSize / imgH);
        const drawW = imgW * scale;
        const drawH = imgH * scale;
        ctx.drawImage(
          logoImg,
          CENTER - drawW / 2,
          CENTER - drawH / 2,
          drawW,
          drawH
        );
        ctx.restore();
      }

      // Outer ring
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, RADIUS + 4, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 6;
      ctx.stroke();
    },
    [prizes, logoImg]
  );

  // Initial draw + redraw when logo loads
  useEffect(() => {
    drawWheel(currentAngleRef.current);
  }, [drawWheel]);

  // Spin animation
  useEffect(() => {
    if (!spinning) return;

    startAngleRef.current = currentAngleRef.current;
    const totalRotation = targetAngle;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / SPIN_DURATION_MS, 1);
      const eased = easeOutExpo(progress);
      const currentRotation = startAngleRef.current + totalRotation * eased;

      currentAngleRef.current = currentRotation % 360;
      drawWheel(currentRotation);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
        onSpinEnd();
      }
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [spinning, targetAngle, drawWheel, onSpinEnd]);

  return (
    <div
      className="relative"
      style={{
        width: WHEEL_SIZE,
        height: WHEEL_SIZE,
        filter: "drop-shadow(0 12px 40px rgba(74,13,46,0.25)) drop-shadow(0 4px 12px rgba(74,13,46,0.15))",
      }}
    >
      {/* Pointer / arrow at the top */}
      <div
        className="absolute z-10 left-1/2 -translate-x-1/2"
        style={{ top: -12 }}
      >
        <svg width="48" height="40" viewBox="0 0 48 40" fill="none">
          <path
            d="M24 40L0 0H48L24 40Z"
            fill="#C2185B"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>

      <canvas
        ref={canvasRef}
        style={{
          width: WHEEL_SIZE,
          height: WHEEL_SIZE,
        }}
      />
    </div>
  );
}
