import type { TVCategory, TVProfessional, TVAd } from "@/types/tv";

export const MOCK_CATEGORIES: TVCategory[] = [
  { id: "cabelo", name: "Cabelo", icon: "scissors" },
  { id: "unhas", name: "Unhas", icon: "sparkles" },
  { id: "sobrancelha", name: "Sobrancelha", icon: "eye" },
  { id: "maquiagem", name: "Maquiagem", icon: "palette" },
  { id: "depilacao", name: "Depilacao", icon: "zap" },
];

export const MOCK_PROFESSIONALS: TVProfessional[] = [
  // Cabelo
  { id: "p1", name: "Ana Paula", avatar: "/logo.png", categoryId: "cabelo", status: "busy", currentClient: "Maria S." },
  { id: "p2", name: "Bianca", avatar: "/logo.png", categoryId: "cabelo", status: "available" },
  { id: "p3", name: "Carlos", avatar: "/logo.png", categoryId: "cabelo", status: "busy-queue", currentClient: "Julia R.", queueCount: 2 },
  // Unhas
  { id: "p4", name: "Denise", avatar: "/logo.png", categoryId: "unhas", status: "busy", currentClient: "Carla M." },
  { id: "p5", name: "Elaine", avatar: "/logo.png", categoryId: "unhas", status: "available" },
  { id: "p6", name: "Fernanda", avatar: "/logo.png", categoryId: "unhas", status: "busy", currentClient: "Leticia P." },
  // Sobrancelha
  { id: "p7", name: "Gisele", avatar: "/logo.png", categoryId: "sobrancelha", status: "busy", currentClient: "Amanda C." },
  { id: "p8", name: "Helena", avatar: "/logo.png", categoryId: "sobrancelha", status: "available" },
  { id: "p9", name: "Isabela", avatar: "/logo.png", categoryId: "sobrancelha", status: "busy-queue", currentClient: "Renata B.", queueCount: 1 },
  // Maquiagem
  { id: "p10", name: "Juliana", avatar: "/logo.png", categoryId: "maquiagem", status: "available" },
  { id: "p11", name: "Karen", avatar: "/logo.png", categoryId: "maquiagem", status: "busy", currentClient: "Priscila D." },
  // Depilacao
  { id: "p12", name: "Larissa", avatar: "/logo.png", categoryId: "depilacao", status: "busy", currentClient: "Tatiana F." },
  { id: "p13", name: "Monica", avatar: "/logo.png", categoryId: "depilacao", status: "available" },
  { id: "p14", name: "Natalia", avatar: "/logo.png", categoryId: "depilacao", status: "busy-queue", currentClient: "Vanessa G.", queueCount: 3 },
  { id: "p15", name: "Olivia", avatar: "/logo.png", categoryId: "depilacao", status: "available" },
];

export const MOCK_ADS: TVAd[] = [
  { id: "ad1", imageUrl: "", alt: "Escova Progressiva com 20% OFF", durationMs: 8000 },
  { id: "ad2", imageUrl: "", alt: "Pacote Noiva — Cabelo + Make + Unhas", durationMs: 8000 },
  { id: "ad3", imageUrl: "", alt: "Acumule Charmes e ganhe prêmios!", durationMs: 8000 },
];

export const MOCK_TICKER_MESSAGES = [
  "Escova Progressiva com 20% de desconto este mês!",
  "Acumule Charmes a cada visita e troque por prêmios exclusivos",
  "Pacote Noiva: Cabelo + Maquiagem + Unhas com 15% OFF",
  "Indique uma amiga e ganhe 50 Charmes de bônus",
  "Novo: Tratamento Capilar com Queratina Líquida",
];

export const STORE_NAME = "Cheia de Charme — Copacabana";
export const STORE_ADDRESS = "Rua Barata Ribeiro, 123 — Copacabana, Rio de Janeiro";
