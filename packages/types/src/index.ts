// === Database Types ===

export type Organization = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Store = {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  settings: Record<string, unknown>;
  created_at: string;
};

export type ProfileRole = "master" | "gestor" | "profissional" | "cliente";

export type Profile = {
  id: string;
  auth_id: string | null;
  store_id: string;
  name: string;
  cpf: string | null;
  phone: string | null;
  email: string | null;
  role: ProfileRole;
  avatar_url: string | null;
  specialty: string | null;
  can_parallel: number;
  is_available: boolean;
  created_at: string;
};

export type Service = {
  id: string;
  store_id: string;
  name: string;
  category: string;
  price_cents: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
};

export type AppointmentStatus =
  | "scheduled"
  | "checked_in"
  | "waiting"
  | "in_progress"
  | "completed"
  | "no_show";

export type AppointmentSource =
  | "totem"
  | "app"
  | "whatsapp"
  | "web"
  | "gestor";

export type Appointment = {
  id: string;
  store_id: string;
  client_id: string;
  professional_id: string | null;
  service_id: string;
  status: AppointmentStatus;
  scheduled_at: string | null;
  checked_in_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  queue_position: number | null;
  ticket_number: string | null;
  qr_code: string | null;
  source: AppointmentSource;
  created_at: string;
};

// === Kiosk Types ===

export type KioskStep =
  | "idle"
  | "identify"
  | "found"
  | "not_found"
  | "register"
  | "select_service"
  | "confirm"
  | "done";

export type IdentifyMethod = "cpf" | "phone";
