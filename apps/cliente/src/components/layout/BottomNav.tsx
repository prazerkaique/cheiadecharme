"use client";

import { Home, CalendarPlus, Gem, User } from "lucide-react";
import { useClientStore } from "@/store/client-store";
import type { BottomTab } from "@/types/client";

const TABS: { id: BottomTab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "booking", label: "Agendar", icon: CalendarPlus },
  { id: "charmes", label: "Charmes", icon: Gem },
  { id: "profile", label: "Perfil", icon: User },
];

export function BottomNav() {
  const activeTab = useClientStore((s) => s.activeTab);
  const setActiveTab = useClientStore((s) => s.setActiveTab);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-brand-border/50"
      style={{ height: "var(--client-bottomnav-h)" }}
    >
      <div className="max-w-lg mx-auto h-full flex items-center justify-around px-2">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onPointerDown={(e) => { e.preventDefault(); setActiveTab(id); }}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                isActive
                  ? "text-cta"
                  : "text-brand-text-muted hover:text-brand-text"
              }`}
            >
              <Icon
                className={`w-6 h-6 transition-transform ${isActive ? "scale-110" : ""}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-xs font-semibold">{label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-cta" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
