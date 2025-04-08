/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'WhiteColor': '#ffffff',
        'ButtonColor': '#EA4548',
        'ButtonHover': '#991b1b',
        'TextColor': '#2e1065'
      },
      fontFamily: {
        'TitleFont': ['"Bebas Neue"', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

