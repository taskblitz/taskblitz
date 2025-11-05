import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['var(--font-montserrat)', 'sans-serif'],
      },
      colors: {
        'purple-primary': '#8b5cf6',
        'purple-dark': '#7c3aed',
        'cyan-accent': '#06b6d4',
        'cyan-light': '#22d3ee',
        'bg-darkest': '#0a0a0a',
        'bg-dark': '#1a1a1a',
        'bg-card': 'rgba(255, 255, 255, 0.05)',
        'bg-hover': 'rgba(255, 255, 255, 0.1)',
        'text-primary': '#ffffff',
        'text-secondary': '#a1a1aa',
        'text-muted': '#71717a',
        'border-subtle': 'rgba(255, 255, 255, 0.1)',
        'border-focus': 'rgba(139, 92, 246, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config