/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          900: '#14532d',
          950: '#022c22', // extra dark for glass panels
        },
        'emerald': {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        'forest-green': {
          800: '#065f46',
          900: '#064e3b',
        },
        'glass-white': 'rgba(255, 255, 255, 0.08)',
        'glass-white-border': 'rgba(255, 255, 255, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'Google Sans', 'Poppins', 'sans-serif'],
        display: ['Poppins', 'Google Sans', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'aurora-glow': 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.05) 50%, transparent 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'wind-sway': 'sway 4s ease-in-out infinite',
        'cloud-move': 'clouds 60s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg) translateX(0px)' },
          '50%': { transform: 'rotate(3deg) translateX(5px)' },
        },
        clouds: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
