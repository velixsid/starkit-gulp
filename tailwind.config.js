/** @type {import('tailwindcss').Config} */
// const colors = require('tailwindcss/colors')
const accents = ['emerald', 'indigo', 'sky', 'pink', 'yellow', 'purple', 'cyan'] // accent colors

module.exports = {
  content: [
    "./src/**/*.{js,html}",
    "node_modules/tw-relix/dist/*.js",
  ],
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('tw-relix/plugin'),
    require('tw-accent')({
      colors: accents,
      root: accents[0],
      cssVarsPrefix: 'tw', // result: --tw-accent-500
      attr: 'theme-accent', // result: <html theme-accent="emerald">...</html>
    }),
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
  safelist: accents.map((accent) => `bg-${accent}-300`)
}

