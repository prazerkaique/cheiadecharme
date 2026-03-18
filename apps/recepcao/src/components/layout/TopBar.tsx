"use client";

import { useReceptionStore } from "@/store/reception-store";
import { formatTime } from "@/lib/format";
import { StatsBar } from "../stats/StatsBar";
import { FlaskConical } from "lucide-react";
import Image from "next/image";

export function TopBar() {
  const now = useReceptionStore((s) => s.now);
  const useMockData = useReceptionStore((s) => s.useMockData);
  const toggleMockData = useReceptionStore((s) => s.toggleMockData);

  return (
    <header className="glass-strong flex h-[var(--rec-topbar-h)] shrink-0 items-center gap-4 border-b border-brand-border px-4">
      {/* Logo + store name */}
      <div className="flex items-center gap-3">
        <Image src="/logo.png" alt="Cheia de Charme" width={32} height={32} className="rounded-full" />
        <div className="hidden sm:block">
          <h1 className="font-display text-[15px] font-semibold text-brand-text leading-tight">
            Cheia de Charme
          </h1>
          <p className="text-[12px] text-brand-text-muted leading-tight">Copacabana</p>
        </div>
      </div>

      {/* Stats — desktop only */}
      <div className="hidden flex-1 justify-center md:flex">
        <StatsBar />
      </div>

      {/* Mock toggle */}
      <button
        type="button"
        onClick={toggleMockData}
        title={useMockData ? "Mock data ativo — clique para desativar" : "Usando dados reais — clique para ativar mock"}
        className={[
          "ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors",
          useMockData
            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
            : "text-brand-text-muted/40 hover:text-brand-text-muted/70",
        ].join(" ")}
      >
        <FlaskConical size={16} />
        {useMockData && <span>Mock</span>}
      </button>

      {/* Clock */}
      <time className="font-display text-[var(--text-clock)] font-semibold text-brand-text tabular-nums">
        {formatTime(now)}
      </time>
    </header>
  );
}
