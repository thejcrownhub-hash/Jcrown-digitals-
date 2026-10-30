/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',
        charcoal: '#1A1A1A',
        panel: '#141414',
        gold: {
          DEFAULT: '#C9A84C',
          bright: '#D4B85A',
          deep: '#8A7434',
        },
        ivory: '#F5F0E8',
        muted: '#C8C0B0',
        line: '#3A3A3A',
        success: '#4CAF50',
        danger: '#E57373',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        site: '72rem',
      },
    },
  },
  plugins: [],
}
