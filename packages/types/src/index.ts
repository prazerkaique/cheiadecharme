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
  commission_rate: number;
  hired_at: string | null;
  is_active: boolean;
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
  description: string | null;
  image_url: string | null;
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
  client_id: string | null;
  professional_id: string | null;
  service_id: string | null;
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

// === Gestor Types ===

export type PaymentMethod = "cash" | "credit" | "debit" | "pix" | "charmes";
export type TransactionStatus = "pending" | "completed" | "cancelled" | "refunded";

export type Transaction = {
  id: string;
  store_id: string;
  appointment_id: string | null;
  professional_id: string | null;
  client_id: string | null;
  service_id: string | null;
  amount_cents: number;
  commission_cents: number;
  payment_method: PaymentMethod;
  status: TransactionStatus;
  transaction_date: string;
  notes: string | null;
  created_at: string;
};

export type ProfessionalService = {
  id: string;
  professional_id: string;
  service_id: string;
  commission_rate: number | null;
  is_active: boolean;
  created_at: string;
};

export type DailySummary = {
  id: string;
  store_id: string;
  summary_date: string;
  total_revenue: number;
  total_appointments: number;
  completed_count: number;
  no_show_count: number;
  avg_ticket_cents: number;
  created_at: string;
};

export type ClientFrequency = "vip" | "regular" | "occasional" | "new";

// === Client App Types ===

export type CharmeTransactionType = "earn" | "spend" | "purchase" | "refund" | "bonus";

export type ClientCharmes = {
  id: string;
  client_id: string;
  store_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
};

export type CharmeTransaction = {
  id: string;
  client_id: string;
  store_id: string;
  amount: number;
  type: CharmeTransactionType;
  reference_id: string | null;
  description: string;
  created_at: string;
};

export type Promotion = {
  id: string;
  store_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  discount_percent: number | null;
  discount_amount_cents: number | null;
  service_id: string | null;
  starts_at: string;
  ends_at: string | null;
  is_active: boolean;
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

// === Game Types ===

export type GameStep = "idle" | "identify" | "payment" | "choose_game" | "spinning" | "scratching" | "prize" | "claimed" | "error";

export type PrizeType = "discount_percent" | "discount_fixed" | "free_service" | "charmes" | "try_again" | "nothing" | "yearly_service";

export type GameType = "roulette" | "scratch";

export interface Prize {
  id: string;
  label: string;
  type: PrizeType;
  value: number;
  color: string;
  weight: number;
  service_id?: string;
}

export interface GameConfig {
  spin_cost_cents: number;
  prizes: Prize[];
  scratchPrizes: Prize[];
  logo_url?: string;
}

export interface GameClient {
  id: string;
  name: string;
  phone: string | null;
  cpf: string | null;
  balance_charmes: number;
}
