import type { KioskService, KioskProfessional } from "@/store/kiosk-store";

export const MOCK_SERVICES: KioskService[] = [
  { id: "s01", name: "Corte Feminino", category: "Cabelo", price_charmes: 80, duration_minutes: 60, image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop" },
  { id: "s02", name: "Corte + Escova Premium", category: "Cabelo", price_charmes: 120, duration_minutes: 90, image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop" },
  { id: "s03", name: "Hidratação Capilar", category: "Cabelo", price_charmes: 90, duration_minutes: 75, image_url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=300&fit=crop" },
  { id: "s04", name: "Coloração Completa", category: "Cabelo", price_charmes: 180, duration_minutes: 120, image_url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop" },
  { id: "s05", name: "Escova Botox", category: "Cabelo", price_charmes: 150, duration_minutes: 90, image_url: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=300&fit=crop" },
  { id: "s06", name: "Manicure Completa", category: "Unhas", price_charmes: 45, duration_minutes: 45, image_url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop" },
  { id: "s07", name: "Pedicure Completa", category: "Unhas", price_charmes: 50, duration_minutes: 50, image_url: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=300&fit=crop" },
  { id: "s08", name: "Gel nas Unhas", category: "Unhas", price_charmes: 85, duration_minutes: 70, image_url: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=300&fit=crop" },
  { id: "s09", name: "Design de Sobrancelha", category: "Sobrancelha", price_charmes: 35, duration_minutes: 30, image_url: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=300&fit=crop" },
  { id: "s10", name: "Henna de Sobrancelha", category: "Sobrancelha", price_charmes: 40, duration_minutes: 40, image_url: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=300&fit=crop" },
  { id: "s11", name: "Maquiagem Social", category: "Maquiagem", price_charmes: 120, duration_minutes: 60, image_url: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop" },
  { id: "s12", name: "Maquiagem para Noivas", category: "Maquiagem", price_charmes: 250, duration_minutes: 90, image_url: "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=400&h=300&fit=crop" },
  { id: "s13", name: "Depilação com Cera", category: "Depilação", price_charmes: 60, duration_minutes: 45, image_url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop" },
  { id: "s14", name: "Limpeza de Pele", category: "Tratamentos", price_charmes: 110, duration_minutes: 60, image_url: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=300&fit=crop" },
  { id: "s15", name: "Peeling Facial", category: "Tratamentos", price_charmes: 140, duration_minutes: 50, image_url: "https://images.unsplash.com/photo-1552693673-1bf958298935?w=400&h=300&fit=crop" },
];

export const MOCK_PROFESSIONALS: KioskProfessional[] = [
  { id: "p01", name: "Ana Silva", avatar_url: null, specialty: "Cabelo & Coloração" },
  { id: "p02", name: "Bruna Costa", avatar_url: null, specialty: "Unhas & Nail Art" },
  { id: "p03", name: "Carla Santos", avatar_url: null, specialty: "Sobrancelha & Make" },
  { id: "p04", name: "Daniela Rocha", avatar_url: null, specialty: "Depilação" },
  { id: "p05", name: "Eduarda Lima", avatar_url: null, specialty: "Cabelo & Escova" },
  { id: "p06", name: "Fernanda Alves", avatar_url: null, specialty: "Manicure & Pedicure" },
];

// Mock client data for IdentifyScreen
export const MOCK_CLIENTS: Record<string, { client: { id: string; name: string; cpf: string; phone: string; balance_charmes: number }; appointments: { id: string; service_name: string; scheduled_at: string; professional_name: string | null }[] }> = {
  "11111111111": {
    client: { id: "mock-maria", name: "Maria Silva", cpf: "111.111.111-11", phone: "(21) 99999-0000", balance_charmes: 500 },
    appointments: [], // will be filled dynamically with today's date
  },
  "00000000000": {
    client: { id: "mock-joana", name: "Joana Santos", cpf: "000.000.000-00", phone: "(21) 98888-0000", balance_charmes: 120 },
    appointments: [],
  },
};

export function getMockClient(inputValue: string) {
  const today = new Date().toISOString().slice(0, 10);

  if (inputValue === "11111111111") {
    return {
      client: MOCK_CLIENTS["11111111111"].client,
      appointments: [
        { id: "apt-1", service_name: "Escova Progressiva", scheduled_at: `${today}T14:30:00`, professional_name: "Ana Paula" },
        { id: "apt-2", service_name: "Manicure em Gel", scheduled_at: `${today}T15:45:00`, professional_name: "Juliana Costa" },
        { id: "apt-3", service_name: "Hidratação Profunda", scheduled_at: `${today}T16:30:00`, professional_name: null },
      ],
    };
  }

  if (inputValue === "00000000000") {
    return {
      client: MOCK_CLIENTS["00000000000"].client,
      appointments: [],
    };
  }

  return null;
}
