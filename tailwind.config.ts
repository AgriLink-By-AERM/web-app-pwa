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
        ink: "#111827",
        body: "#374151",
        muted: "#6B7280",
        subtle: "#9CA3AF",
        surface: "#F2F8F3",
        border: "#E5E7EB",
        factory: "#0F2A1A",
        factoryAccent: "#1E4D2B",
        factoryTint: "#E8F3EC",
        restaurant: "#8A5A05",
        restaurantAccent: "#F9A825",
        restaurantTint: "#FDF3E0"
      },
      boxShadow: {
        panel: "0 1px 4px rgba(15, 42, 26, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
