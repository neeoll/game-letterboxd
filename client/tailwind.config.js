import plugin from 'tailwindcss';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    plugin(function ({ matchUtilities, theme}) {
      matchUtilities(
        {
          'animate-delay': (value) => ({
            animationDelay: value,
          }),
        },
        { values: theme('transitionDelay') }
      )
    }),
  ],
  theme: {
    extend: {
      fontFamily: {
        edunline: ["Edunline", 'sans-serif'],
      }
    },
  },
  variants: {
    extend: {
      visibility: ["group-hover"],
      border: ["group-hover"]
    }
  }
}