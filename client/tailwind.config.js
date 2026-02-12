/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b"
        }
      },
      boxShadow: {
        glass: "0 20px 40px -20px rgba(15, 23, 42, 0.35)",
        soft: "0 10px 30px -15px rgba(16, 185, 129, 0.25)",
      },
      backgroundImage: {
        mesh: "radial-gradient(at 20% 15%, rgba(16,185,129,0.30) 0px, transparent 50%), radial-gradient(at 80% 5%, rgba(52,211,153,0.18) 0px, transparent 50%), radial-gradient(at 50% 85%, rgba(20,184,166,0.20) 0px, transparent 50%)",
      },
    },
  },
  plugins: [],
};