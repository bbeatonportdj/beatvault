import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0A0A0A",
        surface: "#111111",
        card: "#161616",
        border: "#1E1E1E",
        neon: "#00D1FF",
        "neon-dim": "#00A3C7",
        "neon-glow": "rgba(0, 209, 255, 0.15)",
        muted: "#4A4A4A",
        subtle: "#2A2A2A",
        text: {
          primary: "#FFFFFF",
          secondary: "#A0A0A0",
          muted: "#5A5A5A",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 209, 255, 0.4)",
        "neon-sm": "0 0 10px rgba(0, 209, 255, 0.25)",
        "neon-lg": "0 0 40px rgba(0, 209, 255, 0.5)",
        card: "0 4px 24px rgba(0, 0, 0, 0.6)",
      },
      animation: {
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        "slide-in": "slide-in 0.3s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        waveform: "waveform 1.2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0, 209, 255, 0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(0, 209, 255, 0.7)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        waveform: {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
