/** @type {import('tailwindcss').Config} */

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#5f0f0f",
          "secondary": "#f3f4f6",
          "accent": "#1c1917",
          "neutral": "#181818",
          "base-100": "#242a3f",
          "info": "#00b0ff",
          "success": "#00fbbe",
          "warning": "#ff7500",
          "error": "#ff7071",
        },
      },
    ],
  },
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
      require('daisyui'),
  ],
}

