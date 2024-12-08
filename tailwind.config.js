/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ubuntu: ['Ubuntu Mono', 'sans-serif'],
        unbounded: ['Unbounded', 'sans-serif'],
        parkinsans: ['Parkinsans', 'sans-serif'],
      }
    },  },
  plugins: [],
}
