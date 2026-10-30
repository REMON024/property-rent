import type { Config } from 'tailwindcss';

// Colours are CSS variables (RGB triplets) defined in globals.css,
// so light/dark themes and per-market brands only change tokens.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        ink: token('ink'),
        muted: token('muted'),
        line: token('line'),
        brand: token('brand'),
        brandink: token('brandink'),
        brandsoft: token('brandsoft'),
        sign: token('sign'),
        signink: token('signink'),
        warn: token('warn'),
        warnsoft: token('warnsoft'),
        info: token('info'),
        infosoft: token('infosoft'),
        hero: token('hero'),
        heroink: token('heroink'),
        map: token('map'),
        road: token('road'),
        park: token('park'),
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'Noto Sans Bengali', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
