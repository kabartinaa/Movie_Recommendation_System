/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0d0f17',
          card: '#161926',
          border: '#272b3f',
          red: '#e50914',
          gold: '#f5c518',
          purple: '#8b5cf6'
        }
      }
    },
  },
  plugins: [],
}
