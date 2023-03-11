import { DEFAULT_THEME as mantineDefaultTheme } from '@mantine/core';
import type { MantineThemeColors } from '@mantine/core';
import windiDefaultColors from 'windicss/colors';
import type { DefaultColors } from 'windicss/types/config/colors';

const convertColor = (
  mantineColors: MantineThemeColors,
  windiColors: DefaultColors,
) => {
  return Object.fromEntries(
    Object.entries(mantineColors)
      .filter(([key]) => windiColors[key] === undefined) // Filter out colors that already exist in WindiCSS
      .map(([key, value]) => {
        return [
          key,
          {
            50: value[0],
            100: value[1],
            200: value[2],
            300: value[3],
            400: value[4],
            500: value[5],
            600: value[6],
            700: value[7],
            800: value[8],
            900: value[9],
          },
        ];
      }),
  );
};

export default {
  alias: {
    // ...
  },
  attributify: {
    prefix: 'w:',
  },
  darkMode: 'class',
  extract: {
    exclude: ['node_modules', '.git', '.next/**/*'],
    include: ['**/*.{html,mdx,js,jsx,ts,tsx,css}'],
  },
  plugins: [],
  shortcuts: {
    // ...
  },
  safelist: [
    // ...
  ],
  theme: {
    extend: {
      colors: {
        primary: windiDefaultColors.blue,
        ...convertColor(mantineDefaultTheme.colors, windiDefaultColors),
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Merriweather', 'ui-serif', 'Georgia'],
        mono: ['Space Mono', 'ui-monospace', 'SFMono-Regular'],
        heading: ['Quicksand'],
      },
    },
  },
};
