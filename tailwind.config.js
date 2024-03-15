/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,html}",
    "node_modules/tw-relix/dist/*.js",
  ],
  darkMode: ['class', '[theme-mode="dark"]'],
  theme: {
    fontFamily: {
      sans: [
        "Public Sans", "sans-serif"
      ],
    },
    extend: {}
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('tw-relix/plugin'),
    require('tw-accent')({
      colors: ['emerald', 'indigo', 'info'],
      root: 'emerald',
      cssVarsPrefix: 'tw', // result: --tw-accent-500
      attr: 'theme-accent', // result: <html theme-accent="red">...</html>
    }),
  ],
}

