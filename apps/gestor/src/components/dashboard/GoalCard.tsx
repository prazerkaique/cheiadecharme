"use client";

import { Target } from "lucide-react";

interface GoalCardProps {
  title: string;
  current: string;
  goal: string;
  percent: number;
  color?: string;
}

export function GoalCard({ title, current, goal, percent, color = "#EC4899" }: GoalCardProps) {
  const clampedPercent = Math.min(percent, 100);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-bold text-gray-900">{title}</h4>
        <span
          className="rounded-lg px-2 py-0.5 text-xs font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {clampedPercent}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${clampedPercent}%`, backgroundColor: color }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-gray-900">{current}</span>
        <span className="text-gray-400">Meta: {goal}</span>
      </div>
    </div>
  );
}
