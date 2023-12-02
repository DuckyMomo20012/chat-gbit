import {
  MantineProvider as BaseMantineProvider,
  type MantineBreakpointsValues,
  type MantineShadowsValues,
  createTheme,
  rem,
} from '@mantine/core';
import windiDefaultColors from 'windicss/colors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertColor = (windiColors: any) => {
  const convertedColor: {
    [key: string]: string | string[];
  } = {};
  Object.keys(windiColors)
    .filter(
      (keyColor) =>
        [
          'lightBlue',
          'warmGray',
          'trueGray',
          'coolGray',
          'blueGray',
          'zink',
        ].includes(keyColor) === false,
    )
    .forEach((color) => {
      if (windiColors[color] instanceof Object) {
        convertedColor[color] = Object.values(windiColors[color]);
      }
    });

  return convertedColor;
};

const theme = createTheme({
  colors: {
    ...convertColor(windiDefaultColors),
    dark: [
      '#f8fafc',
      '#f1f5f9',
      '#e2e8f0',
      '#cbd5e1',
      '#94a3b8',
      '#64748b',
      '#475569',
      '#334155',
      '#1e293b',
      '#0f172a',
      '#020617',
    ],
    grape: [
      '#fdf4ff',
      '#fae8ff',
      '#f5d0fe',
      '#f0abfc',
      '#e879f9',
      '#d946ef',
      '#c026d3',
      '#a21caf',
      '#86198f',
      '#701a75',
      '#4a044e',
    ],
  },
  primaryColor: 'blue',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, Avenir Next, Avenir, Segoe UI, Helvetica Neue, Helvetica, Cantarell, Ubuntu, Roboto, Noto, Arial, sans-serif',
  fontFamilyMonospace:
    'Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace',
  defaultRadius: 'lg',

  headings: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Avenir Next, Avenir, Segoe UI, Helvetica Neue, Helvetica, Cantarell, Ubuntu, Roboto, Noto, Arial, sans-serif',
    fontWeight: '700',
    sizes: {
      h1: { fontSize: rem(36), lineHeight: '2.5rem' },
      h2: { fontSize: rem(30), lineHeight: '2.25rem' },
      h3: { fontSize: rem(24), lineHeight: '2rem' },
      h4: { fontSize: rem(20), lineHeight: '1.75rem' },
      h5: { fontSize: rem(18), lineHeight: '1.75rem' },
      h6: { fontSize: rem(16), lineHeight: '1.5rem' },
    },
  },

  lineHeights: {
    xs: '1.25',
    sm: '1.375',
    md: '1.5',
    lg: '1.625',
    xl: '2',
  },

  radius: {
    xs: rem(2),
    sm: rem(4),
    md: rem(6),
    lg: rem(8),
    xl: rem(12),
  },

  breakpoints: {
    xs: '30em',
    sm: '40em',
    md: '48em',
    lg: '64em',
    xl: '80em',
    '2xl': '96em',
  } as MantineBreakpointsValues,

  shadows: {
    xs: `0 ${rem(1)} ${rem(2)} 0 rgb(0 0 0 / 0.05)`,
    // prettier-ignore
    sm: `0 ${rem(1)} ${rem(3)} 0 rgb(0 0 0 / 0.1), 0 ${rem(1)} ${rem(2)} ${rem(-1)} rgb(0 0 0 / 0.1)`,
    // prettier-ignore
    md: `0 ${rem(4)} ${rem(6)} ${rem(-1)} rgb(0 0 0 / 0.1), 0 ${rem(2)} ${rem(4)} ${rem(-2)} rgb(0 0 0 / 0.1)`,
    // prettier-ignore
    lg: `0 ${rem(10)} ${rem(15)} ${rem(-3)} rgb(0 0 0 / 0.1), 0 ${rem(4)} ${rem(6)} ${rem(-4)} rgb(0 0 0 / 0.1)`,
    // prettier-ignore
    xl: `0 ${rem(20)} ${rem(25)} ${rem(-5)} rgb(0 0 0 / 0.1), 0 ${rem(8)} ${rem(10)} ${rem(-6)} rgb(0 0 0 / 0.1)`,
    // NOTE: Extend keys rather than breakpoints MUST NOT start with number
    xl2: `0 ${rem(25)} ${rem(50)} ${rem(-12)} rgb(0 0 0 / 0.25)`,
    inner: `inset 0 ${rem(2)} ${rem(4)} 0 rgb(0 0 0 / 0.05)`,
  } as MantineShadowsValues,
});

const MantineProvider = ({ children }: { children?: React.ReactNode }) => {
  return <BaseMantineProvider theme={theme}>{children}</BaseMantineProvider>;
};

export { MantineProvider };
