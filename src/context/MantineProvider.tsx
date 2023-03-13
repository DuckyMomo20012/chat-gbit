import {
  MantineProvider as BaseMantineProvider,
  ColorSchemeProvider,
  Global,
  MantineTheme,
  DEFAULT_THEME as mantineDefaultTheme,
} from '@mantine/core';
import type { ColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import windiDefaultColors from 'windicss/colors';
import windiDefaultTheme from 'windicss/defaultTheme';
import type { DefaultColors } from 'windicss/types/config/colors';
import type { DefaultFontSize, DictStr } from 'windicss/types/interfaces';

const convertBreakpoint = (windiBreakpoint: DictStr) => {
  return Object.fromEntries(
    Object.entries(windiBreakpoint).map(([key, value]) => {
      return [
        key,
        // NOTE: Have to remove 'px' from breakpoint and convert to number
        +value.replace('px', ''),
      ];
    }),
  );
};

// Override Mantine colors
const convertColor = (windiColors: Partial<DefaultColors>) => {
  delete windiColors.lightBlue;
  delete windiColors.warmGray;
  delete windiColors.trueGray;
  delete windiColors.coolGray;
  delete windiColors.blueGray;
  delete windiColors.zink;

  const newColors = Object.fromEntries(
    Object.entries(windiColors)
      .map(([key, value]) => {
        return [key, Object.values(value)];
      })
      .filter((color) => {
        return ![
          'black',
          'white',
          'transparent',
          'inherit',
          'current',
        ].includes(color[0] as string);
      }),
  );

  // NOTE: WindiCSS dark color is too dark
  newColors.dark = mantineDefaultTheme.colors.dark;
  return newColors;
};

const convertFontSize = (windiFontSize: { [key: string]: DefaultFontSize }) => {
  return Object.fromEntries(
    Object.entries(windiFontSize).map(([key, value]) => {
      return [
        key,
        // NOTE: Don't have to convert 'rem' to 'px'
        value[0],
      ];
    }),
  );
};

const theme: MantineTheme = {
  ...mantineDefaultTheme,
  breakpoints: {
    ...mantineDefaultTheme.breakpoints,
    ...convertBreakpoint(windiDefaultTheme.screens as DictStr), // WindiCSS
  },
  colors: {
    ...mantineDefaultTheme.colors,
    ...convertColor(windiDefaultColors),
  },
  defaultRadius: 'md',
  black: windiDefaultColors.black as string,
  white: windiDefaultColors.white as string,
  primaryColor: 'blue',
  primaryShade: 7,
  fontSizes: {
    ...mantineDefaultTheme.fontSizes,
    ...convertFontSize(windiDefaultTheme.fontSize),
  },
  radius: {
    ...mantineDefaultTheme.radius,
    // NOTE: WindiCSS border radius messed up with Mantine
    // ...windiDefaultTheme.borderRadius,
  },
  fontFamily: `Inter,${mantineDefaultTheme.fontFamily}`,
  fontFamilyMonospace: `"Space Mono",${mantineDefaultTheme.fontFamilyMonospace}`,
  headings: {
    ...mantineDefaultTheme.headings,
    fontFamily: `Quicksand,${mantineDefaultTheme.headings.fontFamily}`,
  },
  lineHeight: mantineDefaultTheme.lineHeight,
  loader: 'oval',
  shadows: {
    ...mantineDefaultTheme.shadows,
    ...windiDefaultTheme.boxShadow,
  },
};

const MyGlobalStyles = () => {
  return (
    <Global
      styles={{
        'body.dark': {
          img: {
            filter: 'brightness(.8) contrast(1.2)',
          },
        },
      }}
    />
  );
};

const MantineProvider = ({ children }: { children?: React.ReactNode }) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    if (colorScheme === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [colorScheme]);
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <BaseMantineProvider
        theme={{ ...theme, colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <MyGlobalStyles />
        {children}
      </BaseMantineProvider>
    </ColorSchemeProvider>
  );
};

export { MantineProvider };
