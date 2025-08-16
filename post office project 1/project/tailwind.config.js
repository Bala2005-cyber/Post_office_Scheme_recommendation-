/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'post-red': '#DC2626',
        'post-yellow': '#F59E0B',
        'post-orange': '#EA580C',
      },
      fontFamily: {
        'hindi': ['Noto Sans Devanagari', 'sans-serif'],
      }
    },
  },
  plugins: [],
}