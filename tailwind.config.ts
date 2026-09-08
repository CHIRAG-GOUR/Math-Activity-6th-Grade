import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/game/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          gold: "#FFD700",
          "gold-light": "#FFF3B0",
          "gold-dark": "#B8860B",
          bronze: "#8B5A2B",
          dark: "#0a0c14",
          surface: "#121726",
          blue: "#00F0FF",
          "blue-glow": "#0099FF",
          "blue-dark": "#0B1D3A",
          red: "#FF3366",
          "red-glow": "#FF5500",
          "red-dark": "#3A0B14",
        },
      },
      fontFamily: {
        game: ["var(--font-game)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
        "spin-reverse": "spin-rev 25s linear infinite",
        "float": "float 4s ease-in-out infinite",
        "glow-blue": "glowBlue 2s ease-in-out infinite alternate",
        "glow-red": "glowRed 2s ease-in-out infinite alternate",
        "glow-gold": "glowGold 2s ease-in-out infinite alternate",
      },
      keyframes: {
        "spin-rev": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glowBlue: {
          "0%": { filter: "drop-shadow(0 0 10px rgba(0, 240, 255, 0.4))" },
          "100%": { filter: "drop-shadow(0 0 25px rgba(0, 240, 255, 0.8))" },
        },
        glowRed: {
          "0%": { filter: "drop-shadow(0 0 10px rgba(255, 51, 102, 0.4))" },
          "100%": { filter: "drop-shadow(0 0 25px rgba(255, 51, 102, 0.8))" },
        },
        glowGold: {
          "0%": { filter: "drop-shadow(0 0 15px rgba(255, 215, 0, 0.5))" },
          "100%": { filter: "drop-shadow(0 0 35px rgba(255, 215, 0, 0.9))" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
