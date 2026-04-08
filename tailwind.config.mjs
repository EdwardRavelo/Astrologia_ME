/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'space': {
          950: 'rgb(var(--color-bg-950) / <alpha-value>)',
          800: 'rgb(var(--color-bg-800) / <alpha-value>)',
          700: 'rgb(var(--color-bg-700) / <alpha-value>)',
        },
        'gold': {
          300: 'rgb(var(--color-gold-300) / <alpha-value>)',
          400: 'rgb(var(--color-gold-400) / <alpha-value>)',
        },
        'silver': {
          300: 'rgb(var(--color-silver-300) / <alpha-value>)',
        },
        'star-white': 'rgb(var(--color-text) / <alpha-value>)',
        'nebula-purple': 'rgb(var(--color-nebula-purple) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
