/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        success: '#58CC02', // Duolingo green
        warning: '#FFC800', // Duolingo yellow
        danger: '#FF4B4B', // Duolingo red
        info: '#1CB0F6', // Duolingo blue
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        '3d-success': '0 4px 0 0 #46a302',
        '3d-danger': '0 4px 0 0 #d33131',
        '3d-warning': '0 4px 0 0 #e5b300',
        '3d-info': '0 4px 0 0 #1899d6',
        '3d-gray': '0 4px 0 0 #e5e5e5',
      }
    },
  },
  plugins: [],
}
