const theme = require('./styles/theme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ...theme.colors,

      },
      opacity: theme.opacity,
      blur: theme.blur,
      textShadow: theme.accents,
    },
  },
  
}
