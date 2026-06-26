import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — luxury cultural institution
        ivory: '#FAF7F0',
        warmwhite: '#FCFBF7',
        navy: {
          DEFAULT: '#0B1F3A',
          50: '#E9EEF5',
          100: '#C7D4E5',
          600: '#15355F',
          700: '#0F2A4D',
          800: '#0B1F3A',
          900: '#071528'
        },
        champagne: {
          DEFAULT: '#C9A86A',
          light: '#E2CE9F',
          dark: '#A8884B'
        },
        softgray: '#6B7280',
        ink: '#0A0A0A'
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        widest2: '0.25em'
      },
      maxWidth: {
        content: '1200px'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slow-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 1.2s ease-out both',
        'slow-zoom': 'slow-zoom 20s ease-out forwards'
      }
    }
  },
  plugins: []
};

export default config;
