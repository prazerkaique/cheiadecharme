"use client";

import { useState, useEffect } from "react";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  className?: string;
}

export function NumberInput({ value, onChange, min, max, placeholder, className }: NumberInputProps) {
  const [display, setDisplay] = useState(String(value));

  useEffect(() => {
    setDisplay(String(value));
  }, [value]);

  return (
    <input
      type="text"
      inputMode="numeric"
      value={display}
      placeholder={placeholder}
      className={className ?? "w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"}
      onChange={(e) => {
        const raw = e.target.value;
        // Allow empty or digits only
        if (raw === "" || /^\d+$/.test(raw)) {
          setDisplay(raw);
          const num = raw === "" ? 0 : Number(raw);
          if (min !== undefined && num < min) return;
          if (max !== undefined && num > max) return;
          onChange(num);
        }
      }}
      onBlur={() => {
        // Restore number on blur if empty
        if (display === "") setDisplay("0");
      }}
    />
  );
}
