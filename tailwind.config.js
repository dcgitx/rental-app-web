import defaultTheme from 'tailwindcss/defaultTheme'
import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 0 },
          '50%': { opacity: 1 },
        },
      },
      animation: {
        blink: 'blink 2s infinite',
      },
    },
  },
  plugins: [forms],
}
