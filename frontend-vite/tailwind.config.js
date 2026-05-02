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
          50: '#f2f6fa',
          100: '#e1edf4',
          200: '#c8dfee',
          300: '#a3cbe2',
          400: '#75acd3',
          500: '#5490c2',
          600: '#4075a7',
          700: '#345e8a',
          800: '#2d5073',
          900: '#133A5E', // SmartLearn Logo Color
          950: '#0c253d',
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
