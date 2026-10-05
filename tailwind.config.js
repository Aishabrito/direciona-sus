/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito_600SemiBold'],
        'nunito-regular': ['Nunito_400Regular'],
        'nunito-bold': ['Nunito_800ExtraBold'],
      },
    },
  },
  plugins: [],
};
