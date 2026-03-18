import type { Metadata, Viewport } from "next";
import { Outfit, Nunito } from "next/font/google";
import "@/styles/globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cheia de Charme — Recepcao",
  description: "Painel da recepcao Cheia de Charme",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${nunito.variable}`}>
      <body className="h-dvh w-screen overflow-hidden bg-background font-body antialiased">
        {children}
      </body>
    </html>
  );
}
