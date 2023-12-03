import { Icon } from '@iconify/react';
import { Anchor, Stack, Text, useMantineColorScheme } from '@mantine/core';

const Footer = () => {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  return (
    <Stack align="center" className="items-center">
      <Text className="w-full text-center" size="sm">
        Made with{' '}
        <Icon
          icon={`fluent-emoji-flat:${
            dark ? 'teacup-without-handle' : 'sparkling-heart'
          }`}
          inline={true}
        />{' '}
        by <Anchor href="https://github.com/DuckyMomo20012">Tien Vinh</Anchor>+
        <Anchor href="https://github.com/sangnguyen836">Huu Sang</Anchor>+
        <Anchor href="https://github.com/txmozkuh">Thanh Dang</Anchor>
      </Text>
    </Stack>
  );
};

export { Footer };
