import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "../../apps/*/src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#EC4899",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F9A8D4",
          foreground: "#831843",
        },
        cta: {
          DEFAULT: "#8B5CF6",
          foreground: "#FFFFFF",
        },
        background: "#FDF2F8",
        surface: "#FFFFFF",
        "brand-text": "#831843",
        "brand-text-muted": "#9D174D",
        "brand-border": "#FBCFE8",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },
      fontFamily: {
        display: ['"DM Serif Display"', "serif"],
        body: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "16px",
        lg: "24px",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
