"use client";

import { useTVStore } from "@/store/tv-store";
import { formatTime, formatDate } from "@/lib/format";

export function Clock() {
  const now = useTVStore((s) => s.now);

  return (
    <div className="flex flex-col items-end">
      <span className="font-display font-bold" style={{ fontSize: "var(--text-clock)" }}>
        {formatTime(now)}
      </span>
      <span className="text-brand-text-muted capitalize" style={{ fontSize: "var(--text-small)" }}>
        {formatDate(now)}
      </span>
    </div>
  );
}
