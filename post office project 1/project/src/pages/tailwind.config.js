/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",  // 👈 adjust this to your project structure
  ],
  theme: {
    extend: {
      colors: {
        postRed: '#C8102E',
        postYellow: '#FFD200',
      },
    },
  },
  plugins: [],
}
