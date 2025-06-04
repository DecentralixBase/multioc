/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0e1117',
        'neon-blue': '#00a3ff',
        'neon-purple': '#9d4edd',
        'neon-cyan': '#00fff5',
        'glass-bg': 'rgba(14, 17, 23, 0.7)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'audiowide': ['Audiowide', 'cursive'],
      },
      boxShadow: {
        'neon-blue': '0 0 5px #00a3ff, 0 0 20px rgba(0, 163, 255, 0.3)',
        'neon-purple': '0 0 5px #9d4edd, 0 0 20px rgba(157, 78, 221, 0.3)',
        'neon-cyan': '0 0 5px #00fff5, 0 0 20px rgba(0, 255, 245, 0.3)',
      },
    },
  },
  plugins: [],
} 