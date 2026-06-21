/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark_3: "#616161",
        main_clr: "#3b5898",
        light_blue: "rgb(194 205 241)",
        orange: "#f48726",
        border_clr: "#d6d6d6",
      },
    },
  },
  plugins: [],
};
