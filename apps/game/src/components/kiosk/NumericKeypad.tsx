"use client";

import { Backspace } from "@phosphor-icons/react";

// ---------------------------------------------------------------------------
// Mask helpers
// ---------------------------------------------------------------------------

function applyCpfMask(digits: string): string {
  const d = digits.slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9)
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function applyPhoneMask(digits: string): string {
  const d = digits.slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function applyMask(digits: string, mask: "cpf" | "phone"): string {
  return mask === "cpf" ? applyCpfMask(digits) : applyPhoneMask(digits);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NumericKeypadProps {
  value: string;
  onChange: (value: string) => void;
  mask: "cpf" | "phone";
  maxLength: number;
}

// ---------------------------------------------------------------------------
// Key button
// ---------------------------------------------------------------------------

interface KeyButtonProps {
  label: React.ReactNode;
  onPress: () => void;
  variant?: "default" | "action";
  disabled?: boolean;
}

function KeyButton({
  label,
  onPress,
  variant = "default",
  disabled = false,
}: KeyButtonProps) {
  return (
    <button
      type="button"
      onPointerDown={(e) => {
        e.preventDefault();
        if (!disabled) onPress();
      }}
      disabled={disabled}
      style={
        variant === "action"
          ? { backgroundColor: "rgba(217,75,140,0.06)" }
          : undefined
      }
      className={[
        "glass-key",
        "flex items-center justify-center",
        "w-full rounded-[18px] min-h-[140px]",
        "select-none font-body",
        disabled ? "opacity-30 pointer-events-none" : "",
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

export default function NumericKeypad({
  value,
  onChange,
  mask,
  maxLength,
}: NumericKeypadProps) {
  const masked = applyMask(value, mask);
  const placeholder = mask === "cpf" ? "000.000.000-00" : "(00) 00000-0000";

  function handleDigit(digit: string) {
    if (value.length >= maxLength) return;
    onChange(value + digit);
  }

  function handleBackspace() {
    onChange(value.slice(0, -1));
  }

  function handleClear() {
    onChange("");
  }

  const digitRows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
  ];

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Display */}
      <div className="glass-strong relative w-full rounded-[20px] min-h-[96px] px-8 flex items-center overflow-hidden">
        {masked.length > 0 ? (
          <span className="text-[40px] font-semibold font-body tracking-[0.08em] text-brand-text w-full text-center">
            {masked}
          </span>
        ) : (
          <span
            className="text-[40px] font-body tracking-[0.08em] w-full text-center"
            style={{ color: "rgba(74,13,46,0.30)" }}
          >
            {placeholder}
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

      {/* Keypad grid */}
      <div className="w-full grid grid-cols-3 gap-6">
        {digitRows.map((row) =>
          row.map((digit) => (
            <KeyButton
              key={digit}
              label={
                <span className="text-[64px] font-semibold text-brand-text">
                  {digit}
                </span>
              }
              onPress={() => handleDigit(digit)}
            />
          ))
        )}

        <KeyButton
          label={
            <span className="text-[28px] font-semibold text-brand-text">
              Limpar
            </span>
          }
          onPress={handleClear}
          variant="action"
          disabled={value.length === 0}
        />
        <KeyButton
          label={
            <span className="text-[64px] font-semibold text-brand-text">
              0
            </span>
          }
          onPress={() => handleDigit("0")}
        />
        <KeyButton
          label={
            <Backspace
              size={40}
              weight="light"
              className="text-brand-text"
            />
          }
          onPress={handleBackspace}
          variant="action"
          disabled={value.length === 0}
        />
      </div>
    </div>
  );
}
