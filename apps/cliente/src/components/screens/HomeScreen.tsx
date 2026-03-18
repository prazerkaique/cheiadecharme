"use client";

import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useClientStore } from "@/store/client-store";
import { NextAppointmentBanner } from "@/components/home/NextAppointmentBanner";
import { CharmesBalance } from "@/components/home/CharmesBalance";
import { QuickActions } from "@/components/home/QuickActions";
import { RecentPromotions } from "@/components/home/RecentPromotions";

export function HomeScreen() {
  const profile = useClientStore((s) => s.profile);
  const loadHomeData = useClientStore((s) => s.loadHomeData);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  const firstName = profile?.name?.split(" ")[0] ?? "Cliente";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-4 space-y-5">
      {/* Greeting */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cta flex items-center justify-center text-white font-display font-bold text-lg">
          {firstName[0]}
        </div>
        <div>
          <p className="text-sm text-brand-text-muted">{greeting},</p>
          <h2 className="text-xl font-display font-bold text-brand-text">{firstName}</h2>
        </div>
        <div className="ml-auto">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
      </div>

      <NextAppointmentBanner />
      <CharmesBalance />
      <QuickActions />
      <RecentPromotions />
    </div>
  );
}
