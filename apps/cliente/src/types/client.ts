export type ClientScreen =
  | "login"
  | "otp"
  | "home"
  | "booking"
  | "charmes"
  | "promotions"
  | "history"
  | "profile";

export type BookingStep =
  | "category"
  | "service"
  | "professional"
  | "datetime"
  | "confirm";

export type BottomTab = "home" | "booking" | "charmes" | "profile";

export type ServiceCategory = {
  name: string;
  icon: string;
  count: number;
};
