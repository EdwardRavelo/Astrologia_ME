/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'space': {
          950: '#050510',
          800: '#0d0d2b',
          700: '#161640',
        },
        'gold': {
          300: '#e8c96b',
          400: '#c9a227',
        },
        'silver': {
          300: '#a8b2c8',
        },
        'star-white': '#e8e0d5',
        'nebula-purple': '#6b5b95',
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
