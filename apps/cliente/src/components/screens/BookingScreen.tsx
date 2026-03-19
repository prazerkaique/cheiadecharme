"use client";

import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { useClientStore } from "@/store/client-store";
import { CategoryPicker } from "@/components/booking/CategoryPicker";
import { ServiceList } from "@/components/booking/ServiceList";
import { ProfessionalPicker } from "@/components/booking/ProfessionalPicker";
import { DateTimePicker } from "@/components/booking/DateTimePicker";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { BookingPayment } from "@/components/booking/BookingPayment";

const STEP_TITLES: Record<string, string> = {
  category: "Agendar",
  service: "Servicos",
  professional: "Profissional",
  datetime: "Data e Horario",
  confirm: "Confirmar",
  payment: "Pagamento",
};

export function BookingScreen() {
  const bookingStep = useClientStore((s) => s.bookingStep);
  const loadServices = useClientStore((s) => s.loadServices);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const showBack = bookingStep !== "category";

  return (
    <div className="max-w-lg mx-auto">
      <Header title={STEP_TITLES[bookingStep] ?? "Agendar"} showBack={showBack} />
      <div className="px-4 py-4">
        {bookingStep === "category" && <CategoryPicker />}
        {bookingStep === "service" && <ServiceList />}
        {bookingStep === "professional" && <ProfessionalPicker />}
        {bookingStep === "datetime" && <DateTimePicker />}
        {bookingStep === "confirm" && <BookingSummary />}
        {bookingStep === "payment" && <BookingPayment />}
      </div>
    </div>
  );
}
