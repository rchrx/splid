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
        neu: {
          bg: {
            light: '#ebf0f6',
            dark: '#272f40',
          },
          surface: {
            light: '#ebf0f6',
            dark: '#343e54',
          },
          well: {
            light: '#dfe6f0',
            dark: '#212736',
          }
        },
        splid: {
          bg: '#272f40',
          card: '#343e54',
          brand: '#39445d',
          well: '#212736',
          teal: '#14b4b4',
          mint: '#3cc8a0',
          spring: '#50dca0',
          coral: '#f07864',
          cyan: '#28c8b4',
        },
        midnight: {
          950: '#1d222e',
          900: '#212736',
          850: '#272f40',
          800: '#2f384c',
          700: '#343e54',
          600: '#39445d',
          500: '#485575',
          400: '#607096',
        },
        electric: {
          teal: '#14b4b4',
          mint: '#3cc8a0',
          cyan: '#28c8b4',
          sky: '#38bdf8',
          coral: '#f07864',
          emerald: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        // Light Neomorphism (Cool Ice Slate)
        'neu-flat-light': '6px 6px 14px #bec8d6, -6px -6px 14px #ffffff',
        'neu-raised-light': '10px 10px 22px #b6c2d2, -10px -10px 22px #ffffff',
        'neu-raised-sm-light': '3px 3px 8px #bec8d6, -3px -3px 8px #ffffff',
        'neu-inset-light': 'inset 3px 3px 6px #bcc7d5, inset -3px -3px 6px #ffffff',
        'neu-inset-deep-light': 'inset 5px 5px 10px #b2bfcf, inset -5px -5px 10px #ffffff',
        
        // Dark Neomorphism (Tuned to Splid Logo #343e54 / #39445d)
        'neu-flat-dark': '6px 6px 16px rgba(16, 21, 30, 0.75), -5px -5px 14px rgba(78, 93, 125, 0.28)',
        'neu-raised-dark': '10px 10px 24px rgba(14, 18, 27, 0.85), -8px -8px 20px rgba(82, 98, 132, 0.32)',
        'neu-raised-sm-dark': '4px 4px 10px rgba(16, 21, 30, 0.7), -3px -3px 8px rgba(78, 93, 125, 0.26)',
        'neu-inset-dark': 'inset 3px 3px 7px rgba(13, 17, 25, 0.85), inset -3px -3px 7px rgba(78, 93, 125, 0.2)',
        'neu-inset-deep-dark': 'inset 5px 5px 12px rgba(10, 14, 21, 0.95), inset -5px -5px 12px rgba(78, 93, 125, 0.15)',

        // Button Tactile States
        'neu-btn-light': '5px 5px 12px #bec8d6, -5px -5px 12px #ffffff',
        'neu-btn-hover-light': '7px 7px 16px #b4bfcd, -7px -7px 16px #ffffff',
        'neu-btn-active-light': 'inset 3px 3px 6px #bcc7d5, inset -3px -3px 6px #ffffff',

        'neu-btn-dark': '5px 5px 14px rgba(16, 21, 30, 0.75), -4px -4px 12px rgba(78, 93, 125, 0.28)',
        'neu-btn-hover-dark': '7px 7px 18px rgba(14, 18, 27, 0.85), -6px -6px 15px rgba(82, 98, 132, 0.35)',
        'neu-btn-active-dark': 'inset 3px 3px 6px rgba(13, 17, 25, 0.85), inset -3px -3px 6px rgba(78, 93, 125, 0.2)',

        // Neumorphic Primary Button Glows matching logo
        'neu-glow-teal': '0 0 20px rgba(20, 180, 180, 0.45), 4px 4px 12px rgba(0, 0, 0, 0.25)',
        'neu-glow-mint': '0 0 20px rgba(60, 200, 160, 0.45), 4px 4px 12px rgba(0, 0, 0, 0.25)',
        'neu-glow-cyan': '0 0 20px rgba(40, 200, 180, 0.45), 4px 4px 12px rgba(0, 0, 0, 0.25)',
        'neu-glow-coral': '0 0 20px rgba(240, 120, 100, 0.45), 4px 4px 12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'soft-float': 'softFloat 5s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        softFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '0.9' },
        }
      }
    },
  },
  plugins: [],
}
