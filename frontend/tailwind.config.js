/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        dark: {
          900: '#050505',
          800: '#0a0a0a',
          700: '#111111',
          600: '#1a1a1a',
        },
        cyber: {
          light: '#e0f7fa',
          green: '#00e676',
          blue: '#00b4d8',
          purple: '#7b2cbf',
          red: '#ff0054',
        }
      },
      boxShadow: {
        'glow-blue': '0 0 15px rgba(0, 180, 216, 0.5)',
        'glow-red': '0 0 15px rgba(255, 0, 84, 0.5)',
        'glow-green': '0 0 15px rgba(0, 230, 118, 0.5)',
        'glow-purple': '0 0 15px rgba(123, 44, 191, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)', boxShadow: '0 0 15px rgba(0, 180, 216, 0.2)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)', boxShadow: '0 0 25px rgba(0, 180, 216, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '33%': { transform: 'translate(-2px, 2px)' },
          '66%': { transform: 'translate(2px, -2px)' },
        }
      },
      backgroundImage: {
        'cyber-grid': "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDM5LjVoNDBWNDBoLTQweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIvPjxwYXRoIGQ9Ik0zOS41IDB2NDBoMC41VjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIi8+PC9zdmc+')",
        'cyber-gradient': 'linear-gradient(135deg, rgba(0,180,216,0.1) 0%, rgba(123,44,191,0.1) 100%)',
      }
    },
  },
  plugins: [],
}
