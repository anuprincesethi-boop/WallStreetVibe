/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'fin-dark': '#0a0c10',
        'fin-card': '#11141b',
        'fin-accent': '#00e5ff',
        'fin-border': '#1f2937',
      }
    }
  },
  plugins: [],
}