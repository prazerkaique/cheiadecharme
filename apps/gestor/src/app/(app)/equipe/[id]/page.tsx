"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { ProfessionalForm, type ProfessionalFormData } from "@/components/equipe/ProfessionalForm";
import { ServiceAssignment } from "@/components/equipe/ServiceAssignment";
import {
  fetchProfessional,
  updateProfessional,
  fetchProfessionalServices,
  setProfessionalServices,
} from "@/lib/queries/professionals";
import { fetchServices } from "@/lib/queries/services";
import type { Profile, Service, ProfessionalService } from "@cheia/types";

export default function EditProfissionalPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const store = useAuthStore((s) => s.store);
  const addToast = useUIStore((s) => s.addToast);

  const [professional, setProfessional] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [assigned, setAssigned] = useState<ProfessionalService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !store?.id) return;

    Promise.all([
      fetchProfessional(id),
      fetchProfessionalServices(id),
      fetchServices(store.id),
    ]).then(([pro, proServices, allServices]) => {
      setProfessional(pro);
      setAssigned(proServices);
      setServices(allServices);
      setLoading(false);
    });
  }, [id, store?.id]);

  const handleUpdate = async (data: ProfessionalFormData) => {
    if (!id) return;
    try {
      await updateProfessional(id, data);
      addToast("Profissional atualizado", "success");
      router.push("/equipe");
    } catch {
      addToast("Erro ao atualizar profissional", "error");
    }
  };

  const handleSaveServices = async (
    assignments: { service_id: string; commission_rate: number | null }[]
  ) => {
    if (!id) return;
    try {
      await setProfessionalServices(id, assignments);
      addToast("Servicos atualizados", "success");
      const updated = await fetchProfessionalServices(id);
      setAssigned(updated);
    } catch {
      addToast("Erro ao salvar servicos", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="py-20 text-center text-sm text-gray-400">
        Profissional nao encontrado
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ProfessionalForm
        title={`Editar: ${professional.name}`}
        submitLabel="Salvar Alteracoes"
        defaultValues={{
          name: professional.name,
          email: professional.email ?? "",
          phone: professional.phone ?? "",
          specialty: professional.specialty ?? "",
          commission_rate: professional.commission_rate,
          is_active: professional.is_active,
        }}
        onSubmit={handleUpdate}
      />

      <ServiceAssignment
        services={services}
        assigned={assigned}
        defaultCommission={professional.commission_rate}
        onSave={handleSaveServices}
      />
    </div>
  );
}
