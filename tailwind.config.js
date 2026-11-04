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
        midnight: {
          950: '#060814',
          900: '#0b0f1d',
          850: '#0f172a',
          800: '#151d36',
          700: '#1e294b',
          600: '#2d3b66',
        },
        electric: {
          purple: '#8b5cf6',
          violet: '#7c3aed',
          cyan: '#06b6d4',
          sky: '#38bdf8',
          pink: '#ec4899',
          lavender: '#c084fc',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
        'glass-glow': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        'glass-glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.45)',
        'neon-cyan': '0 0 20px rgba(6, 182, 212, 0.45)',
      },
      animation: {
        'blob': 'blob 10s infinite alternate',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.75' },
        }
      }
    },
  },
  plugins: [],
}

