/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#14B8A6',
          50: '#E6FAF8',
          100: '#CCF5F1',
          200: '#99EBE3',
          300: '#66E1D5',
          400: '#33D7C7',
          500: '#14B8A6',
          600: '#109384',
          700: '#0C6E63',
          800: '#084A42',
          900: '#042521',
        },
        accent: {
          DEFAULT: '#F97316',
          50: '#FEF3E8',
          100: '#FDE7D1',
          200: '#FBCFA3',
          300: '#F9B775',
          400: '#F79F47',
          500: '#F97316',
          600: '#D85B0A',
          700: '#A34508',
          800: '#6E2E05',
          900: '#391703',
        },
      },
    },
  },
  plugins: [],
}
