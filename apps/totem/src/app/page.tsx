"use client";

import { useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useKioskStore } from "@/store/kiosk-store";
import IdleScreen from "@/components/screens/IdleScreen";
import IdentifyScreen from "@/components/screens/IdentifyScreen";
import ClientFoundScreen from "@/components/screens/ClientFoundScreen";
import RegisterScreen from "@/components/screens/RegisterScreen";
import SelectServiceScreen from "@/components/screens/SelectServiceScreen";
import ConfirmScreen from "@/components/screens/ConfirmScreen";
import DoneScreen from "@/components/screens/DoneScreen";
import TimeoutWarningModal from "@/components/kiosk/TimeoutWarningModal";
import CancelConfirmModal from "@/components/kiosk/CancelConfirmModal";

const IDLE_TIMEOUT_MS = 45_000; // 45s before showing warning
const WARNING_SECONDS = 15; // 15s countdown in the warning modal

const screenVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25, ease: "easeIn" as const } },
} as const;

export default function KioskFlow() {
  const step = useKioskStore((s) => s.step);
  const reset = useKioskStore((s) => s.reset);
  const showTimeoutWarning = useKioskStore((s) => s.showTimeoutWarning);
  const timeoutSecondsRemaining = useKioskStore((s) => s.timeoutSecondsRemaining);
  const showTimeout = useKioskStore((s) => s.showTimeout);
  const hideTimeout = useKioskStore((s) => s.hideTimeout);
  const setTimeoutSeconds = useKioskStore((s) => s.setTimeoutSeconds);
  const showCancelConfirm = useKioskStore((s) => s.showCancelConfirm);
  const hideCancel = useKioskStore((s) => s.hideCancel);

  // --- Idle inactivity timer: show warning after IDLE_TIMEOUT_MS ---
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAllTimers = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  const startInactivityTimer = useCallback(() => {
    clearAllTimers();
    // Only set timeout when NOT on idle or done screen
    if (step !== "idle" && step !== "done") {
      inactivityTimerRef.current = setTimeout(() => {
        showTimeout();
      }, IDLE_TIMEOUT_MS);
    }
  }, [step, clearAllTimers, showTimeout]);

  // Start/restart inactivity timer when step changes
  useEffect(() => {
    if (!showTimeoutWarning) {
      startInactivityTimer();
    }
    return () => clearAllTimers();
  }, [step, showTimeoutWarning, startInactivityTimer, clearAllTimers]);

  // Reset inactivity timer on any user interaction (only when warning is NOT shown)
  useEffect(() => {
    if (showTimeoutWarning) return;
    const handleInteraction = () => startInactivityTimer();
    window.addEventListener("pointerdown", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    return () => {
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, [showTimeoutWarning, startInactivityTimer]);

  // Countdown timer when warning modal is shown
  useEffect(() => {
    if (!showTimeoutWarning) {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      return;
    }

    setTimeoutSeconds(WARNING_SECONDS);
    countdownTimerRef.current = setInterval(() => {
      const current = useKioskStore.getState().timeoutSecondsRemaining;
      if (current <= 1) {
        // Time's up — reset to idle
        clearAllTimers();
        hideTimeout();
        reset();
      } else {
        setTimeoutSeconds(current - 1);
      }
    }, 1000);

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
    };
  }, [showTimeoutWarning, clearAllTimers, hideTimeout, reset, setTimeoutSeconds]);

  function handleTimeoutContinue() {
    hideTimeout();
    startInactivityTimer();
  }

  function handleTimeoutEnd() {
    clearAllTimers();
    hideTimeout();
    reset();
  }

  function handleCancelConfirm() {
    hideCancel();
    reset();
  }

  function handleCancelGoBack() {
    hideCancel();
  }

  const renderScreen = () => {
    switch (step) {
      case "idle":
        return <IdleScreen key="idle" />;
      case "identify":
        return <IdentifyScreen key="identify" />;
      case "found":
        return <ClientFoundScreen key="found" />;
      case "not_found":
      case "register":
        return <RegisterScreen key="register" />;
      case "select_service":
        return <SelectServiceScreen key="select_service" />;
      case "confirm":
        return <ConfirmScreen key="confirm" />;
      case "done":
        return <DoneScreen key="done" />;
      default:
        return <IdleScreen key="idle" />;
    }
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {/* Timeout warning modal — overlays everything */}
      {showTimeoutWarning && step !== "idle" && step !== "done" && (
        <TimeoutWarningModal
          secondsRemaining={timeoutSecondsRemaining}
          onContinue={handleTimeoutContinue}
          onEnd={handleTimeoutEnd}
        />
      )}

      {/* Cancel confirmation modal */}
      {showCancelConfirm && (
        <CancelConfirmModal
          onConfirmCancel={handleCancelConfirm}
          onGoBack={handleCancelGoBack}
        />
      )}
    </main>
  );
}
