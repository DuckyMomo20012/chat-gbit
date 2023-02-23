import { DEFAULT_THEME as mantineDefaultTheme } from '@mantine/core';
import type { MantineThemeColors } from '@mantine/core';
import windiDefaultColors from 'windicss/colors';
import type { DefaultColors } from 'windicss/types/config/colors';

type ConvertedWindiColors = {
  [k in keyof MantineThemeColors]: DefaultColors[keyof DefaultColors];
};

// Don't override WindiCSS colors
const convertColor = (
  mantineColors: MantineThemeColors,
  windiColors: DefaultColors,
) => {
  const newColorPalette = {} as ConvertedWindiColors;
  Object.keys(mantineColors).forEach((colorName) => {
    if (windiColors[colorName] instanceof Object === false) {
      const newColor = {};
      mantineColors[colorName].forEach((_colorHex, index) => {
        newColor[`${index * 100}`] = mantineColors[colorName][index];
      });
      newColor['50'] = newColor['0'];
      delete newColor['0'];
    }
  });

  return newColorPalette;
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
