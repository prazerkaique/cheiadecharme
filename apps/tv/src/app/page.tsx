"use client";

import { useEffect, useRef } from "react";
import { useTVStore } from "@/store/tv-store";
import { TVShell } from "@/components/layout/TVShell";
import { CallModal } from "@/components/tv/CallModal";
import { AdOverlay } from "@/components/tv/AdOverlay";

const CLOCK_INTERVAL = 1000;
const AD_INTERVAL = 60_000;
const AD_DURATION = 8_000;
const CALL_DISMISS = 10_000;

export default function TVPage() {
  const tick = useTVStore((s) => s.tick);
  const showNextAd = useTVStore((s) => s.showNextAd);
  const hideAd = useTVStore((s) => s.hideAd);
  const showAd = useTVStore((s) => s.showAd);
  const currentCall = useTVStore((s) => s.currentCall);
  const dismissCall = useTVStore((s) => s.dismissCall);
  const init = useTVStore((s) => s.init);
  const subscribe = useTVStore((s) => s.subscribe);
  const unsubscribe = useTVStore((s) => s.unsubscribe);

  const callTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Supabase init + realtime subscription
  useEffect(() => {
    init();
    subscribe();
    return () => unsubscribe();
  }, [init, subscribe, unsubscribe]);

  // Clock tick
  useEffect(() => {
    const id = setInterval(tick, CLOCK_INTERVAL);
    return () => clearInterval(id);
  }, [tick]);

  // Ad rotation
  useEffect(() => {
    const id = setInterval(() => {
      showNextAd();
      setTimeout(hideAd, AD_DURATION);
    }, AD_INTERVAL);
    return () => clearInterval(id);
  }, [showNextAd, hideAd]);

  // Auto-dismiss calls
  useEffect(() => {
    if (callTimerRef.current) clearTimeout(callTimerRef.current);
    if (currentCall) {
      callTimerRef.current = setTimeout(dismissCall, CALL_DISMISS);
    }
    return () => {
      if (callTimerRef.current) clearTimeout(callTimerRef.current);
    };
  }, [currentCall, dismissCall]);

  return (
    <>
      <TVShell />
      {showAd && <AdOverlay />}
      {currentCall && <CallModal call={currentCall} />}
    </>
  );
}
