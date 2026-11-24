/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Legacy keys (preserved for backwards compatibility)
        dark_3: "#616161",
        main_clr: "#3b5898",
        light_blue: "rgb(194 205 241)",
        orange: "#f48726",
        border_clr: "#d6d6d6",

        // 60% Dominant Canvas & Surfaces
        canvas: "#F8FAFC",
        surface: "#FFFFFF",
        "surface-muted": "#F1F5F9",

        // 30% Secondary & Structure
        brand: {
          DEFAULT: "#3B5898",
          dark: "#1E3A8A",
          light: "#E0E7FF",
        },
        slate: {
          border: "#E2E8F0",
          heading: "#0F172A",
          body: "#334155",
          muted: "#64748B",
        },

        // 10% Accent
        accent: {
          DEFAULT: "#F48726",
          hover: "#DD6B10",
          light: "#FFEDD5",
        },

        // Semantics
        status: {
          success: "#16A34A",
          "success-bg": "#DCFCE7",
          warning: "#D97706",
          "warning-bg": "#FEF3C7",
          danger: "#DC2626",
          "danger-bg": "#FEE2E2",
          info: "#2563EB",
          "info-bg": "#DBEAFE",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)",
        modal: "0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)",
        cardLg: "0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};
