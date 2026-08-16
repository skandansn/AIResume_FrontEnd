import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.25s ease-out both',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        airesume: {
          primary: '#4f46e5',
          'primary-content': '#ffffff',
          secondary: '#0ea5e9',
          'secondary-content': '#ffffff',
          accent: '#14b8a6',
          'accent-content': '#ffffff',
          neutral: '#1e293b',
          'neutral-content': '#f8fafc',
          'base-100': '#ffffff',
          'base-200': '#f5f6fa',
          'base-300': '#e5e7ef',
          'base-content': '#1e293b',
          info: '#0284c7',
          success: '#15803d',
          warning: '#b45309',
          error: '#dc2626',
          '--rounded-box': '0.9rem',
          '--rounded-btn': '0.6rem',
          '--rounded-badge': '0.4rem',
          '--border-btn': '1px',
        },
      },
    ],
  },
}

export default config
