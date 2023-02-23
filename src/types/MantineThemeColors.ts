import type { MantineThemeColors as BaseMantineThemeColors } from '@mantine/core';
import type { DefaultColors } from 'windicss/types/config/colors';

export type MantineThemeColors = Omit<
  {
    [k in keyof DefaultColors]: BaseMantineThemeColors[keyof BaseMantineThemeColors];
  },
  | 'lightBlue'
  | 'warmGray'
  | 'trueGray'
  | 'coolGray'
  | 'blueGray'
  | 'zink'
  | 'inherit'
  | 'transparent'
  | 'current'
  | 'black'
  | 'white'
>;
