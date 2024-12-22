/** @type {import('tailwindcss').Config} */

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#5f0f0f",
          "secondary": "#f3bdbd",
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
    extend: {
      keyframes:{
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        float: 'float 2s ease-in-out infinite',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
      require('daisyui'),
  ],
}

