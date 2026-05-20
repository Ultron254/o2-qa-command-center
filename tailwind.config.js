/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Theme-aware colors via CSS variables (RGB triplets) */
        surface: {
          primary: 'rgb(var(--surface-primary) / <alpha-value>)',
          secondary: 'rgb(var(--surface-secondary) / <alpha-value>)',
          elevated: 'rgb(var(--surface-elevated) / <alpha-value>)',
          inset: 'rgb(var(--surface-inset) / <alpha-value>)',
          hover: 'rgb(var(--surface-hover) / <alpha-value>)',
          header: 'rgb(var(--surface-header) / <alpha-value>)',
          sidebar: 'rgb(var(--surface-sidebar) / <alpha-value>)',
          overlay: 'rgb(var(--surface-overlay) / <alpha-value>)',
        },
        content: {
          primary: 'rgb(var(--content-primary) / <alpha-value>)',
          secondary: 'rgb(var(--content-secondary) / <alpha-value>)',
          muted: 'rgb(var(--content-muted) / <alpha-value>)',
          inverse: 'rgb(var(--content-inverse) / <alpha-value>)',
          link: 'rgb(var(--content-link) / <alpha-value>)',
        },
        line: {
          DEFAULT: 'rgb(var(--line-default) / <alpha-value>)',
          subtle: 'rgb(var(--line-subtle) / <alpha-value>)',
          strong: 'rgb(var(--line-strong) / <alpha-value>)',
          focus: 'rgb(var(--line-focus) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover) / <alpha-value>)',
          pressed: 'rgb(var(--accent-pressed) / <alpha-value>)',
          subtle: 'rgb(var(--accent-subtle) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        /* Fixed colors (same across all themes) */
        status: {
          pass: '#22C55E',
          'pass-bg': 'rgba(34,197,94,0.1)',
          fail: '#EF4444',
          'fail-bg': 'rgba(239,68,68,0.1)',
          blocked: '#EAB308',
          'blocked-bg': 'rgba(234,179,8,0.1)',
          skip: '#9CA3AF',
          'skip-bg': 'rgba(156,163,175,0.1)',
          running: '#3B82F6',
          'running-bg': 'rgba(59,130,246,0.1)',
        },
        priority: {
          critical: '#EF4444',
          high: '#F97316',
          medium: '#EAB308',
          low: '#9CA3AF',
        },
        wit: {
          epic: '#8B5CF6',
          feature: '#22C55E',
          story: '#3B82F6',
          bug: '#EF4444',
          task: '#EAB308',
        },
        oxygene: {
          DEFAULT: '#F97316',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        },
      },
      fontFamily: {
        sans: ['Inter', '"Segoe UI"', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Cascadia Code"', '"Consolas"', 'monospace'],
      },
      boxShadow: {
        'xs': '0 1px 2px rgb(var(--shadow-color) / 0.04)',
        'sm': '0 1px 3px rgb(var(--shadow-color) / 0.06), 0 1px 2px rgb(var(--shadow-color) / 0.04)',
        'md': '0 4px 6px -1px rgb(var(--shadow-color) / 0.06), 0 2px 4px -2px rgb(var(--shadow-color) / 0.04)',
        'lg': '0 10px 15px -3px rgb(var(--shadow-color) / 0.06), 0 4px 6px -4px rgb(var(--shadow-color) / 0.04)',
        'card': '0 1px 3px rgb(var(--shadow-color) / 0.08), 0 1px 2px rgb(var(--shadow-color) / 0.06)',
        'float': '0 8px 30px rgb(var(--shadow-color) / 0.12)',
      },
      fontSize: {
        'xxs': ['10px', '14px'],
      },
      borderRadius: {
        'xs': '4px',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.25s ease-out',
        'slide-down': 'slide-down 0.25s ease-out',
        'scale-in': 'scale-in 0.15s ease-out',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
