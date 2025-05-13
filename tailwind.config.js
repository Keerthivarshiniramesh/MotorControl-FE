/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          100: '#339cfe',
          200: '#1c7ef4',
          300: '#1566e0',
          400: '#1853b5',
          500: '#1b4d99',
          600: '#142d57'
        },
        'secondary': {
          100: '#e0f2fe',
          200: '#b9e5fe',
          300: '#7cd2fd',
          400: '#36bcfa',
          500: '#0ca4eb',
          600: '#0081c6',
          700: '#0168a3',
          800: '#065886',
          900: '#0b496f'
        }
      }
    },
  },
  plugins: [],
}