// eslint-disable-next-line import/no-extraneous-dependencies
import twContainerQueries from '@tailwindcss/container-queries';
import type { Config } from 'tailwindcss';
import twDefaultColors from 'tailwindcss/colors';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['class', '[data-mantine-color-scheme="dark"]'],
  // NOTE: Ah, tailwindcss utilities can't beat antd styles.
  important: true,
  theme: {
    extend: {
      colors: {
        dark: twDefaultColors.slate,
        grape: twDefaultColors.fuchsia,
      },
    },
    screens: {
      xs: '30em',
      sm: '40em',
      md: '48em',
      lg: '64em',
      xl: '80em',
      '2xl': '96em',
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [twContainerQueries],
} satisfies Config;
