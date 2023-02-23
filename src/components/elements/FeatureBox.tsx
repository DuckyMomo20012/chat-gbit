import { Box } from '@mantine/core';
import clsx from 'clsx';
import type { MantineThemeColors } from '@/types/MantineThemeColors';

const FeatureBox = ({
  color,
  innerClassName,
  outerClassName,
  children,
  ...props
}: {
  color: keyof MantineThemeColors;
  innerClassName?: string;
  outerClassName?: string;
  children?: React.ReactNode;
}) => {
  return (
    <Box
      className={clsx(
        'relative before:(absolute inset-0 content-DEFAULT border-dashed rounded-lg border-3)',
        outerClassName,
      )}
      sx={(theme) => {
        return {
          '::before': {
            borderColor: theme.colors[color][3],
          },
        };
      }}
      {...props}
    >
      <Box
        className={clsx(
          'border-3 rounded-lg transform hover:(-translate-x-3 -translate-y-3) duration-150 bg-white dark:bg-dark-50 h-full p-5',
          innerClassName,
        )}
        sx={(theme) => ({
          borderColor: theme.colors[color][4],
        })}
      >
        {children}
      </Box>
    </Box>
  );
};

export { FeatureBox };
