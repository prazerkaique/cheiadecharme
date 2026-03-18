"use client";

import { ChevronLeft } from "lucide-react";
import { useClientStore } from "@/store/client-store";

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export function Header({ title, showBack = false }: HeaderProps) {
  const goBack = useClientStore((s) => s.goBack);

  return (
    <header
      className="sticky top-0 z-30 glass-strong flex items-center gap-3 px-4"
      style={{ height: "var(--client-header-h)" }}
    >
      {showBack && (
        <button
          onPointerDown={(e) => { e.preventDefault(); goBack(); }}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary/30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-brand-text" />
        </button>
      )}
      <h1 className="text-lg font-display font-semibold text-brand-text truncate">
        {title}
      </h1>
    </header>
  );
}
