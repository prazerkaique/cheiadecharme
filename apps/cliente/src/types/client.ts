export type ClientScreen =
  | "login"
  | "otp"
  | "home"
  | "booking"
  | "charmes"
  | "promotions"
  | "history"
  | "prizes"
  | "profile";

export type BookingStep =
  | "category"
  | "service"
  | "professional"
  | "datetime"
  | "confirm"
  | "payment";

export type BottomTab = "home" | "booking" | "charmes" | "profile";

export type LoginMethod = "phone" | "email" | "cpf";

export type ServiceCategory = {
  name: string;
  icon: string;
  count: number;
};
