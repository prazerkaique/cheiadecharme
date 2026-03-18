"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { ProfessionalForm, type ProfessionalFormData } from "@/components/equipe/ProfessionalForm";
import { createProfessional } from "@/lib/queries/professionals";

export default function NovoProfissionalPage() {
  const router = useRouter();
  const store = useAuthStore((s) => s.store);
  const addToast = useUIStore((s) => s.addToast);

  const handleSubmit = async (data: ProfessionalFormData) => {
    if (!store?.id) return;
    try {
      await createProfessional(store.id, data);
      addToast("Profissional criado com sucesso", "success");
      router.push("/equipe");
    } catch {
      addToast("Erro ao criar profissional", "error");
    }
  };

  return (
    <ProfessionalForm
      title="Novo Profissional"
      submitLabel="Criar Profissional"
      onSubmit={handleSubmit}
    />
  );
}
