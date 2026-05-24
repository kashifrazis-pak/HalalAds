import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#0A5C36",
          "green-light": "#0F7A49",
          "green-dark": "#073D24",
          gold: "#C9A84C",
          "gold-light": "#E2C47A",
          "gold-dark": "#A8872E",
          cream: "#F9F7F2",
          "cream-dark": "#EEE9DF",
          charcoal: "#1A1A2E",
          "charcoal-light": "#2E2E45",
          muted: "#6B7280",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #0A5C36 0%, #073D24 100%)",
        "gradient-gold": "linear-gradient(135deg, #C9A84C 0%, #A8872E 100%)",
        "gradient-hero": "linear-gradient(160deg, #0A5C36 0%, #1A1A2E 100%)",
      },
      boxShadow: {
        "brand-sm": "0 2px 8px rgba(10, 92, 54, 0.15)",
        "brand-md": "0 4px 20px rgba(10, 92, 54, 0.2)",
        "brand-lg": "0 8px 40px rgba(10, 92, 54, 0.25)",
        "gold-sm": "0 2px 8px rgba(201, 168, 76, 0.2)",
        "gold-md": "0 4px 20px rgba(201, 168, 76, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
