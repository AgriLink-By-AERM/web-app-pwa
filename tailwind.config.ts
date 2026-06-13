import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0D1B2A",
        body: "#1E3448",
        muted: "#64748B",
        subtle: "#94A3B8",
        surface: "#F1F5F9",
        border: "#E2EBF0",
        factory: "#14532D",
        factoryAccent: "#16A34A",
        factoryTint: "#F0FDF4",
        restaurant: "#78350F",
        restaurantAccent: "#D97706",
        restaurantTint: "#FFFBEB"
      },
      boxShadow: {
        panel: "0 1px 2px rgba(13, 27, 42, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
