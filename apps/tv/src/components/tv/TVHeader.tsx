"use client";

import Image from "next/image";
import { STORE_NAME } from "@/lib/mock-data";
import { Clock } from "./Clock";

export function TVHeader() {
  return (
    <header
      className="glass-strong flex items-center justify-between px-8"
      style={{ height: "var(--tv-header-h)", borderRadius: 0 }}
    >
      <div className="flex items-center gap-4">
        <Image src="/logo.png" alt="Cheia de Charme" width={48} height={48} className="rounded-full" />
        <span className="font-display font-bold text-brand-text" style={{ fontSize: "var(--text-title)" }}>
          {STORE_NAME}
        </span>
      </div>

      <Clock />
    </header>
  );
}
