"use client";

export function LoadingSpinner({ size = 32 }: { size?: number }) {
  return (
    <div
      className="rounded-full border-3 border-cta border-t-transparent animate-spin"
      style={{ width: size, height: size }}
    />
  );
}
