export type ProfessionalStatus = "available" | "busy" | "busy-queue";

export interface TVProfessional {
  id: string;
  name: string;
  avatar: string;
  categoryId: string;
  status: ProfessionalStatus;
  currentClient?: string;
  queueCount?: number;
}

export interface TVCategory {
  id: string;
  name: string;
  icon: string;
}

export interface TVCall {
  id: string;
  clientName: string;
  professionalName: string;
  service: string;
  code: string;
  timestamp: number;
}

export interface TVAd {
  id: string;
  imageUrl: string;
  alt: string;
  durationMs: number;
}
