"use client";

import { useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/store/game-store";
import IdleScreen from "@/components/screens/IdleScreen";
import IdentifyScreen from "@/components/screens/IdentifyScreen";
import PaymentScreen from "@/components/screens/PaymentScreen";
import SpinningScreen from "@/components/screens/SpinningScreen";
import PrizeScreen from "@/components/screens/PrizeScreen";
import ClaimedScreen from "@/components/screens/ClaimedScreen";
import ChooseGameScreen from "@/components/screens/ChooseGameScreen";
import ScratchingScreen from "@/components/screens/ScratchingScreen";
import TimeoutWarningModal from "@/components/kiosk/TimeoutWarningModal";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const IDLE_TIMEOUT_MS = 45_000;
const WARNING_SECONDS = 15;

const screenVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25, ease: "easeIn" as const } },
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GameFlow() {
  const step = useGameStore((s) => s.step);
  const reset = useGameStore((s) => s.reset);
  const showTimeoutWarning = useGameStore((s) => s.showTimeoutWarning);
  const timeoutSecondsRemaining = useGameStore((s) => s.timeoutSecondsRemaining);
  const showTimeout = useGameStore((s) => s.showTimeout);
  const hideTimeout = useGameStore((s) => s.hideTimeout);
  const setTimeoutSeconds = useGameStore((s) => s.setTimeoutSeconds);

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
    if (step !== "idle" && step !== "prize" && step !== "claimed" && step !== "spinning" && step !== "scratching") {
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

  // Reset inactivity timer on user interaction
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

  // Countdown timer when warning is shown
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
      const current = useGameStore.getState().timeoutSecondsRemaining;
      if (current <= 1) {
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

  const renderScreen = () => {
    switch (step) {
      case "idle":
        return <IdleScreen key="idle" />;
      case "identify":
        return <IdentifyScreen key="identify" />;
      case "payment":
        return <PaymentScreen key="payment" />;
      case "choose_game":
        return <ChooseGameScreen key="choose_game" />;
      case "spinning":
        return <SpinningScreen key="spinning" />;
      case "scratching":
        return <ScratchingScreen key="scratching" />;
      case "prize":
        return <PrizeScreen key="prize" />;
      case "claimed":
        return <ClaimedScreen key="claimed" />;
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

      {/* Timeout warning */}
      {showTimeoutWarning && step !== "idle" && step !== "prize" && step !== "claimed" && (
        <TimeoutWarningModal
          secondsRemaining={timeoutSecondsRemaining}
          onContinue={handleTimeoutContinue}
          onEnd={handleTimeoutEnd}
        />
      )}
    </main>
  );
}
