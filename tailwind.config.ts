import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './App.tsx',
    './utils/**/*.{js,ts,jsx,tsx}',
    './services/**/*.{js,ts,jsx,tsx}',
  ],
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
        'flag-red': '#C8102E',
        'flag-green': '#008A44',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
