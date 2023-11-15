/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Helvetica Bold', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

