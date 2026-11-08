import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': 'var(--bg)',
        'dark-alt': 'var(--surface-raised)',
        'surface': 'var(--surface)',
        'surface-alt': 'var(--surface-raised)',
        'surface-light': 'var(--accent-soft)',
        'brand-yellow': 'var(--accent)',
        'brand-yellow-dark': '#114cac',
        'status-success': '#137651',
        'status-danger': '#c33349',
        'status-warning': '#ad570d',
        'status-info': '#1665b5',
        'status-purple': '#465b97',
      },
      borderColor: {
        'subtle': 'var(--border)',
        'light': '#e9eef5',
        'strong': '#bdcbdc',
      },
      textColor: {
        'primary': 'var(--text)',
        'secondary': 'var(--text-secondary)',
        'tertiary': 'var(--text-muted)',
        'muted': 'var(--text-muted)',
      },
    },
  },
  plugins: [],
}
export default config
