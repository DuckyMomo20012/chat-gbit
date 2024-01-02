'use client';

import {
  MantineProvider as BaseMantineProvider,
  type MantineBreakpointsValues,
  type MantineShadowsValues,
  createTheme,
  rem,
} from '@mantine/core';

const theme = createTheme({
  colors: {
    // prettier-ignore
    slate: [ '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a', '#020617' ],
    // prettier-ignore
    gray: [ '#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827', '#030712' ],
    // prettier-ignore
    zinc: [ '#fafafa', '#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa', '#71717a', '#52525b', '#3f3f46', '#27272a', '#18181b', '#09090b' ],
    // prettier-ignore
    neutral: [ '#fafafa', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040', '#262626', '#171717', '#0a0a0a' ],
    // prettier-ignore
    stone: [ '#fafaf9', '#f5f5f4', '#e7e5e4', '#d6d3d1', '#a8a29e', '#78716c', '#57534e', '#44403c', '#292524', '#1c1917', '#0c0a09' ],
    // prettier-ignore
    red: [ '#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#450a0a' ],
    // prettier-ignore
    orange: [ '#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12', '#431407' ],
    // prettier-ignore
    amber: [ '#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03' ],
    // prettier-ignore
    yellow: [ '#fefce8', '#fef9c3', '#fef08a', '#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207', '#854d0e', '#713f12', '#422006' ],
    // prettier-ignore
    lime: [ '#f7fee7', '#ecfccb', '#d9f99d', '#bef264', '#a3e635', '#84cc16', '#65a30d', '#4d7c0f', '#3f6212', '#365314', '#1a2e05' ],
    // prettier-ignore
    green: [ '#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#052e16' ],
    // prettier-ignore
    emerald: [ '#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#022c22' ],
    // prettier-ignore
    teal: [ '#f0fdfa', '#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a', '#042f2e' ],
    // prettier-ignore
    cyan: [ '#ecfeff', '#cffafe', '#a5f3fc', '#67e8f9', '#22d3ee', '#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63', '#083344' ],
    // prettier-ignore
    sky: [ '#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e', '#082f49' ],
    // prettier-ignore
    blue: [ '#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a', '#172554' ],
    // prettier-ignore
    indigo: [ '#eef2ff', '#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81', '#1e1b4b' ],
    // prettier-ignore
    violet: [ '#f5f3ff', '#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95', '#2e1065' ],
    // prettier-ignore
    purple: [ '#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87', '#3b0764' ],
    // prettier-ignore
    fuchsia: [ '#fdf4ff', '#fae8ff', '#f5d0fe', '#f0abfc', '#e879f9', '#d946ef', '#c026d3', '#a21caf', '#86198f', '#701a75', '#4a044e' ],
    // prettier-ignore
    pink: [ '#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843', '#500724' ],
    // prettier-ignore
    rose: [ '#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185', '#f43f5e', '#e11d48', '#be123c', '#9f1239', '#881337', '#4c0519' ],
    // prettier-ignore
    dark: [ '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a', '#020617' ],
    // prettier-ignore
    grape: [ '#fdf4ff', '#fae8ff', '#f5d0fe', '#f0abfc', '#e879f9', '#d946ef', '#c026d3', '#a21caf', '#86198f', '#701a75', '#4a044e' ],
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
