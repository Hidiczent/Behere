/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ← ต้องมี
  ],
  theme: {
    extend: {
      colors: {
        primary: "#567C8D",
        secondary: "#F8F1E6",
      },
      fontFamily: {
        lao: ['"Noto Sans Lao"', "system-ui", "sans-serif"],
        laoLooped: ['"Noto Sans Lao Looped"', '"Noto Sans Lao"', "sans-serif"],
        laoSerif: ['"Noto Serif Lao"', "serif"],
      },
    },
  },
  plugins: [],
};
