/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: "#0d9488",
        "brand-soft": "#d1fae5",
        "brand-fg": "#ffffff",
      },
    },
  },
  plugins: [],
}
