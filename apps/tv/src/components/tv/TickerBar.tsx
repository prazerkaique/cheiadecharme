"use client";

import { MOCK_TICKER_MESSAGES } from "@/lib/mock-data";

export function TickerBar() {
  const separator = "  \u2605  ";
  const text = MOCK_TICKER_MESSAGES.join(separator) + separator;

  return (
    <div
      className="glass-strong flex items-center overflow-hidden"
      style={{ height: "var(--tv-ticker-h)", borderRadius: 0 }}
    >
      <div className="ticker-scroll flex whitespace-nowrap" style={{ fontSize: "var(--text-ticker)" }}>
        <span className="px-4 font-semibold text-brand-text">{text}</span>
        <span className="px-4 font-semibold text-brand-text">{text}</span>
      </div>
    </div>
  );
}
