import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f5f6f8',
          100: '#e8eaef',
          200: '#c9ced8',
          300: '#9ba3b3',
          400: '#6b7388',
          500: '#444c61',
          600: '#2c3245',
          700: '#1c2233',
          800: '#11151f',
          850: '#0a0e16',
          900: '#070a10',
          950: '#03050a',
        },
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        signal: {
          ok: '#10b981',
          warn: '#f59e0b',
          bad: '#ef4444',
          info: '#3b82f6',
        },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Inter',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
        display: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Inter',
          'sans-serif',
        ],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.025em',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft-sm': '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 1px 2px 0 rgba(0,0,0,0.4)',
        'soft-md': '0 1px 0 0 rgba(255,255,255,0.05) inset, 0 4px 12px -2px rgba(0,0,0,0.5)',
        'soft-lg': '0 1px 0 0 rgba(255,255,255,0.05) inset, 0 12px 32px -8px rgba(0,0,0,0.6)',
        'ring-glow': '0 0 0 1px rgba(34,211,238,0.35), 0 0 18px -2px rgba(34,211,238,0.25)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 480ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        'shimmer': 'shimmer 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
