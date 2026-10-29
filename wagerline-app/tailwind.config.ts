import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#05080D',
        'dark-alt': '#080C12',
        'surface': '#0B1119',
        'surface-alt': '#0E151E',
        'surface-light': '#101822',
        'brand-yellow': '#F4D900',
        'brand-yellow-dark': '#D4B800',
        'status-success': '#32D583',
        'status-danger': '#FF4D5A',
        'status-warning': '#FFB547',
        'status-info': '#4DA3FF',
        'status-purple': '#9B7BFF',
      },
      borderColor: {
        'subtle': 'rgba(255, 255, 255, 0.06)',
        'light': 'rgba(255, 255, 255, 0.08)',
        'strong': 'rgba(255, 255, 255, 0.12)',
      },
      textColor: {
        'primary': 'rgba(255, 255, 255, 0.95)',
        'secondary': 'rgba(255, 255, 255, 0.70)',
        'tertiary': 'rgba(255, 255, 255, 0.45)',
        'muted': 'rgba(255, 255, 255, 0.30)',
      },
    },
  },
  plugins: [],
}
export default config
