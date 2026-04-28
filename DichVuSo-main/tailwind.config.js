/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'pattern-overlay': "url('/src/assets/img/pattern-overlay-01.png')"
      },
      fontFamily: {
        arial: ['Arial', 'sans-serif'],
        roboto: ['Roboto Serif', 'serif']
      }
    }
  },
  plugins: []
}
