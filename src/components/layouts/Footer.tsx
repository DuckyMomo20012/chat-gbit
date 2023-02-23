import { Icon } from '@iconify/react';
import {
  Anchor,
  Footer as MantineFooter,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';

const Footer = () => {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  return (
    <MantineFooter height={24}>
      <Stack align="center" className="children:w-1/2 items-center">
        <Text align="center" className="w-full" size="sm">
          Made with{' '}
          <Icon
            icon={`fluent-emoji-flat:${
              dark ? 'teacup-without-handle' : 'sparkling-heart'
            }`}
            inline={true}
          />{' '}
          by <Anchor href="https://github.com/DuckyMomo20012">Tien Vinh</Anchor>
          +<Anchor href="https://github.com/sangnguyen836">Huu Sang</Anchor>+
          <Anchor href="https://github.com/txmozkuh">Thanh Dang</Anchor>
        </Text>
      </Stack>
    </MantineFooter>
  );
};

export { Footer };
