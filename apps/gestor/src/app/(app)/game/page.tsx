"use client";

import { useEffect, useState } from "react";
import { Target, Ticket, Settings } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useGameConfigStore } from "@/store/game-config-store";
import { RouletteTab } from "@/components/game/RouletteTab";
import { ScratchTab } from "@/components/game/ScratchTab";
import { GeneralTab } from "@/components/game/GeneralTab";

type GameTab = "roulette" | "scratch" | "general";

const TABS = [
  { key: "roulette" as GameTab, label: "Roleta", icon: Target },
  { key: "scratch" as GameTab, label: "Raspadinha", icon: Ticket },
  { key: "general" as GameTab, label: "Geral", icon: Settings },
];

export default function GamePage() {
  const store = useAuthStore((s) => s.store);
  const { loading, fetch } = useGameConfigStore();
  const [activeTab, setActiveTab] = useState<GameTab>("roulette");

  useEffect(() => {
    if (store?.id) fetch(store.id);
  }, [store?.id, fetch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cheia de Sorte</h1>
        <p className="text-sm text-gray-500">Gerencie os jogos e premios</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              activeTab === key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "roulette" && <RouletteTab />}
      {activeTab === "scratch" && <ScratchTab />}
      {activeTab === "general" && <GeneralTab />}
    </div>
  );
}
