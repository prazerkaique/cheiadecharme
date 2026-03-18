"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useClientStore } from "@/store/client-store";

const ease = [0.22, 1, 0.36, 1] as const;

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

function generateDates(count: number): { date: string; dayNum: number; weekday: string; monthLabel: string }[] {
  const result = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    result.push({
      date: d.toISOString().split("T")[0],
      dayNum: d.getDate(),
      weekday: WEEKDAYS[d.getDay()],
      monthLabel: d.toLocaleDateString("pt-BR", { month: "short" }),
    });
  }
  return result;
}

function generateTimeSlots(): string[] {
  const slots = [];
  for (let h = 9; h < 19; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

export function DateTimePicker() {
  const selectedDate = useClientStore((s) => s.selectedDate);
  const selectedTime = useClientStore((s) => s.selectedTime);
  const selectDate = useClientStore((s) => s.selectDate);
  const selectTime = useClientStore((s) => s.selectTime);
  const setBookingStep = useClientStore((s) => s.setBookingStep);

  const dates = useMemo(() => generateDates(14), []);
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  const canProceed = selectedDate && selectedTime;

  return (
    <div className="space-y-5">
      {/* Date selection */}
      <div>
        <h3 className="text-base font-display font-semibold text-brand-text px-1 mb-3">
          Escolha a data
        </h3>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2 -mx-1 px-1">
          {dates.map(({ date, dayNum, weekday, monthLabel }) => {
            const isSelected = selectedDate === date;
            const isToday = date === new Date().toISOString().split("T")[0];
            return (
              <button
                key={date}
                onPointerDown={(e) => { e.preventDefault(); selectDate(date); }}
                className={`flex flex-col items-center gap-1 py-2.5 px-3 rounded-xl shrink-0 transition-all ${
                  isSelected
                    ? "bg-gradient-to-b from-cta to-primary text-white shadow-lg"
                    : "glass-strong hover:bg-surface"
                }`}
              >
                <span className={`text-[10px] font-semibold uppercase ${isSelected ? "text-white/80" : "text-brand-text-muted"}`}>
                  {isToday ? "Hoje" : weekday}
                </span>
                <span className={`text-lg font-display font-bold ${isSelected ? "text-white" : "text-brand-text"}`}>
                  {dayNum}
                </span>
                <span className={`text-[10px] ${isSelected ? "text-white/70" : "text-brand-text-muted"}`}>
                  {monthLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time selection */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease }}
        >
          <h3 className="text-base font-display font-semibold text-brand-text px-1 mb-3">
            Escolha o horario
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  onPointerDown={(e) => { e.preventDefault(); selectTime(time); }}
                  className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-cta to-primary text-white shadow-md"
                      : "glass-strong text-brand-text hover:bg-surface"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Continue button */}
      {canProceed && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease }}
          onPointerDown={(e) => { e.preventDefault(); setBookingStep("confirm"); }}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-cta to-primary text-white font-display font-semibold text-lg transition-all hover:shadow-lg active:scale-[0.98]"
        >
          Continuar
        </motion.button>
      )}
    </div>
  );
}
