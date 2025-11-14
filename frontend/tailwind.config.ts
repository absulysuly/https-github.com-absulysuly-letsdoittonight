import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        'theme-bg': 'var(--color-background)',
        'theme-text-base': 'var(--color-text-base)',
        'theme-text-muted': 'var(--color-text-muted)',
        'on-primary': 'var(--color-text-on-primary)',
        'brand-hot-pink': 'var(--color-accent)',
        'brand-teal': '#0D9488',
        'flag-red': '#C8102E',
        'flag-green': '#008A44',
        'formal-primary': {
          100: 'var(--color-primary-100, #EBF8FF)',
          500: 'var(--color-primary, #4299E1)',
          600: 'var(--color-primary-dark, #3182CE)',
          700: 'var(--color-primary-darker, #2B6CB0)',
        },
        official: {
          100: 'var(--color-background-soft, #F7FAFC)',
          200: 'var(--color-border, #EDF2F7)',
          300: 'var(--color-border-dark, #E2E8F0)',
          700: 'var(--color-text-muted, #4A5568)',
          800: 'var(--color-text-base, #2D3748)',
          900: 'var(--color-text-deep, #1A202C)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'sans-serif'],
      },
      keyframes: {
        'progress-bar': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        'scroll-x': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'progress-bar': 'progress-bar 1.5s ease-out forwards',
        'scroll-x': 'scroll-x 20s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
