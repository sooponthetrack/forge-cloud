import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F6F1E7",
        charcoal: "#211E1B",
        stone: "#E7DFCF",
        ink: "#1B1815",
        muted: "#8A8072",
        ember: "#C1531B",
        success: "#4B7A5B",
        warning: "#C08A2E",
        danger: "#A23B2E",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "10px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(27,24,21,0.04), 0 6px 20px rgba(27,24,21,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
