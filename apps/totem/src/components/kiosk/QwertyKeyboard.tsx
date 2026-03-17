"use client";

import { useState } from "react";
import { Backspace } from "@phosphor-icons/react";

// ---------------------------------------------------------------------------
// Layout definition
// ---------------------------------------------------------------------------

const ROW_1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"] as const;
const ROW_2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"] as const;
const ROW_3 = ["Z", "X", "C", "V", "B", "N", "M"] as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QwertyKeyboardProps {
  value: string;
  onChange: (value: string) => void;
}

// ---------------------------------------------------------------------------
// Individual letter / action key
// ---------------------------------------------------------------------------

interface KeyProps {
  label: React.ReactNode;
  onPress: () => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

function Key({
  label,
  onPress,
  className = "",
  style,
  disabled = false,
}: KeyProps) {
  return (
    <button
      type="button"
      onPointerDown={(e) => {
        e.preventDefault();
        if (!disabled) onPress();
      }}
      disabled={disabled}
      style={style}
      className={[
        "glass-key",
        "flex items-center justify-center",
        "rounded-[14px] min-h-[80px]",
        "select-none font-body",
        disabled ? "opacity-30 pointer-events-none" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Shift state machine (3-press cycle):
 *   off  → press → shift (one-shot)
 *   shift → press → caps lock
 *   caps lock → press → off
 *
 * Initial state: shift=true so the first letter of a name is naturally
 * capitalised.
 */
export default function QwertyKeyboard({ value, onChange }: QwertyKeyboardProps) {
  // "shift"    = one-shot uppercase, reverts after next letter
  // "capslock" = sustained uppercase until toggled off
  // "off"      = lowercase
  type ShiftMode = "off" | "shift" | "capslock";
  const [shiftMode, setShiftMode] = useState<ShiftMode>("shift");

  const isUpper = shiftMode !== "off";

  function handleLetter(letter: string) {
    const char = isUpper ? letter.toUpperCase() : letter.toLowerCase();
    onChange(value + char);
    // One-shot: revert to off after typing when in shift (not caps lock)
    if (shiftMode === "shift") setShiftMode("off");
  }

  function handleBackspace() {
    onChange(value.slice(0, -1));
  }

  function handleSpace() {
    onChange(value + " ");
  }

  function handleShift() {
    setShiftMode((prev) => {
      if (prev === "off") return "shift";
      if (prev === "shift") return "capslock";
      return "off"; // capslock → off
    });
  }

  const shiftIsActive = shiftMode !== "off";
  const isCapsLock = shiftMode === "capslock";

  // Shift key: when active use gradient bg override via inline style
  const shiftStyle: React.CSSProperties = shiftIsActive
    ? {
        background: "linear-gradient(to right, #D94B8C, #C2185B)",
        color: "#ffffff",
        boxShadow: "0 2px 12px rgba(194,24,91,0.35)",
      }
    : { backgroundColor: "rgba(217,75,140,0.06)" };

  // Backspace: subtle pink tint
  const backspaceStyle: React.CSSProperties = {
    backgroundColor: "rgba(217,75,140,0.06)",
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* ------------------------------------------------------------------ */}
      {/* Display area                                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="glass-strong relative w-full rounded-[20px] min-h-[88px] px-8 flex items-center overflow-hidden">
        {value.length > 0 ? (
          <span className="text-[34px] font-semibold font-body text-brand-text w-full truncate flex items-center">
            {value}
            <span className="ml-[2px] inline-block w-[2px] h-7 bg-cta align-middle animate-pulse flex-shrink-0" />
          </span>
        ) : (
          <span
            className="text-[34px] font-body w-full"
            style={{ color: "rgba(74,13,46,0.30)" }}
          >
            Digite seu nome
          </span>
        )}
        {/* Gradient underline */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(to right, rgba(217,75,140,0.30), rgba(194,24,91,0.30), rgba(217,75,140,0.30))",
          }}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Row 1: Q W E R T Y U I O P                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="w-full flex gap-2">
        {ROW_1.map((letter) => (
          <Key
            key={letter}
            label={
              <span className="text-[28px] font-semibold text-brand-text">
                {isUpper ? letter : letter.toLowerCase()}
              </span>
            }
            onPress={() => handleLetter(letter)}
            className="min-w-[64px] flex-1"
          />
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Row 2: A S D F G H J K L (indented ~3%)                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="w-full flex gap-2 px-[3%]">
        {ROW_2.map((letter) => (
          <Key
            key={letter}
            label={
              <span className="text-[28px] font-semibold text-brand-text">
                {isUpper ? letter : letter.toLowerCase()}
              </span>
            }
            onPress={() => handleLetter(letter)}
            className="min-w-[64px] flex-1"
          />
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Row 3: Shift / Z X C V B N M / Backspace                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="w-full flex gap-2 items-center">
        {/* Shift key — overrides glass-key bg via inline style when active */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            handleShift();
          }}
          style={shiftStyle}
          className={[
            "glass-key",
            "flex items-center justify-center",
            "rounded-[14px] min-h-[80px] flex-[1.5]",
            "select-none font-body",
          ].join(" ")}
        >
          {isCapsLock ? (
            <span className="text-[18px] font-semibold tracking-widest uppercase text-white">
              CAPS
            </span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={shiftIsActive ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={2}
              className="w-6 h-6"
              style={{ color: shiftIsActive ? "#ffffff" : "var(--brand-text)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 15.75l7.5-7.5 7.5 7.5"
              />
            </svg>
          )}
        </button>

        {/* Letter keys */}
        {ROW_3.map((letter) => (
          <Key
            key={letter}
            label={
              <span className="text-[28px] font-semibold text-brand-text">
                {isUpper ? letter : letter.toLowerCase()}
              </span>
            }
            onPress={() => handleLetter(letter)}
            className="min-w-[64px] flex-1"
          />
        ))}

        {/* Backspace */}
        <Key
          label={
            <Backspace
              size={24}
              weight="light"
              className="text-brand-text"
            />
          }
          onPress={handleBackspace}
          style={backspaceStyle}
          className="flex-[1.5]"
          disabled={value.length === 0}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Row 4: Space bar                                                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="w-full flex px-[12%]">
        <Key
          label={
            <span className="text-[22px] text-brand-text-muted">espaço</span>
          }
          onPress={handleSpace}
          className="flex-1"
        />
      </div>
    </div>
  );
}
