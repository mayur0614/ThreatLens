/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a0a',
          800: '#141414',
          700: '#1f1f1f',
          600: '#2b2b2b',
        },
        cyber: {
          green: '#00ff41',
          blue: '#00f0ff',
          red: '#ff003c',
        }
      }
    },
  },
  plugins: [],
}
