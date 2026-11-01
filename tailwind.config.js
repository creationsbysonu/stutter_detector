/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0ea5e9",
          soft: "#e0f2fe",
          fg: "#ffffff",
        },
        fluent: "#10b981",
        stutter: "#ef4444",
      },
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "Noto Sans Devanagari",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        deva: ["Noto Sans Devanagari", "Plus Jakarta Sans", "sans-serif"],
      },
      container: {
        center: true,
        screens: { "2xl": "1240px" },
      },
      letterSpacing: {
        mega: "0.4em",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};
