"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useClientStore } from "@/store/client-store";
import { BottomNav } from "./BottomNav";
import { LoginScreen } from "@/components/screens/LoginScreen";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { BookingScreen } from "@/components/screens/BookingScreen";
import { CharmesScreen } from "@/components/screens/CharmesScreen";
import { PromotionsScreen } from "@/components/screens/PromotionsScreen";
import { HistoryScreen } from "@/components/screens/HistoryScreen";
import { PrizesScreen } from "@/components/screens/PrizesScreen";
import { ProfileScreen } from "@/components/screens/ProfileScreen";

const ease = [0.22, 1, 0.36, 1] as const;

export function AppShell() {
  const screen = useClientStore((s) => s.screen);
  const isLoggedIn = useClientStore((s) => s.isLoggedIn);

  const showBottomNav = isLoggedIn && screen !== "login";

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease }}
          style={{
            paddingBottom: showBottomNav ? "var(--client-bottomnav-h)" : 0,
          }}
        >
          {screen === "login" && <LoginScreen />}
          {screen === "home" && <HomeScreen />}
          {screen === "booking" && <BookingScreen />}
          {screen === "charmes" && <CharmesScreen />}
          {screen === "promotions" && <PromotionsScreen />}
          {screen === "history" && <HistoryScreen />}
          {screen === "prizes" && <PrizesScreen />}
          {screen === "profile" && <ProfileScreen />}
        </motion.div>
      </AnimatePresence>

      {showBottomNav && <BottomNav />}
    </>
  );
}
