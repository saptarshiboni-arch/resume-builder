/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf8f5',
          100: '#f4efe8',
          200: '#e7ddce',
          300: '#d5c4aa',
          400: '#be9d76',
          500: '#9d7c54',
          600: '#7e5f3c',
          700: '#62472d',
          800: '#4c3724',
          900: '#38281a',
          950: '#1e140d',
        },
        slate: {
          850: '#141518',
          950: '#0c0d0e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        display: ['Outfit', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'glow': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
        'glow-lg': '0 10px 30px -4px rgba(0, 0, 0, 0.12)',
        'resume': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 0 1px 1px rgba(0, 0, 0, 0.05)'
      }
    },
  },
  plugins: [],
}
