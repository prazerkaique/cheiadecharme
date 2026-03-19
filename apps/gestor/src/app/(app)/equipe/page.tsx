"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useEquipeStore } from "@/store/equipe-store";
import { useConfigStore } from "@/store/config-store";
import { ProfessionalList } from "@/components/equipe/ProfessionalList";

export default function EquipePage() {
  const store = useAuthStore((s) => s.store);
  const showMock = useConfigStore((s) => s.settings?.show_mock_data ?? true);
  const { professionals, loading, fetch: fetchTeam } = useEquipeStore();

  useEffect(() => {
    if (store?.id) fetchTeam(store.id, showMock);
  }, [store?.id, showMock, fetchTeam]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  return <ProfessionalList professionals={professionals} />;
}
