import { Icon } from '@iconify/react';
import {
  ActionIcon,
  Anchor,
  Avatar,
  Burger,
  Group,
  Image,
  Text,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import Link from 'next/link';

const items = [
  {
    path: '/',
    label: 'Home',
    color: 'indigo',
    icon: 'material-symbols:home',
  },
];

const Header = ({
  isNavbarOpened,
  toggleNavbar,
}: {
  isNavbarOpened: boolean;
  toggleNavbar: () => void;
}) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Group className="h-full w-full flex-nowrap px-4">
      <Burger
        hiddenFrom="sm"
        onClick={toggleNavbar}
        opened={isNavbarOpened}
        size="sm"
      />
      <Anchor
        className="flex items-center gap-2 whitespace-nowrap"
        component={Link}
        href="/"
        underline="never"
      >
        <Avatar color="indigo" radius="sm" size="md" variant="filled">
          <Image alt="logo" height={28} src="/img/chatgpt.svg" width={28} />
        </Avatar>
        <Text className="text-center" fw={700}>
          Chat GBiT
        </Text>
      </Anchor>

      <Group className="hidden flex-1 sm:flex">
        {items.map((item) => (
          <Link
            className="text-inherit no-underline hover:underline dark:text-white"
            href={item.path}
            key={item.path}
          >
            {item.label}
          </Link>
        ))}
      </Group>

      <Group className="flex-grow" justify="flex-end">
        <Tooltip label={dark ? 'Light mode' : 'Dark mode'}>
          <ActionIcon
            aria-label="Toggle color scheme"
            className="hidden sm:flex"
            color="blue"
            data-test-id="color-scheme-toggle"
            onClick={() => toggleColorScheme()}
            size="lg"
            variant="outline"
          >
            <Icon
              icon={
                dark
                  ? 'material-symbols:dark-mode'
                  : 'material-symbols:light-mode'
              }
              width={24}
            />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Source code">
          <Anchor
            data-test-id="github-link"
            href="https://github.com/DuckyMomo20012/chat-gbit"
            target="_blank"
          >
            <ActionIcon
              aria-label="GitHub link"
              role="link"
              size="lg"
              variant="outline"
            >
              <Icon icon="ant-design:github-filled" width={24} />
            </ActionIcon>
          </Anchor>
        </Tooltip>
      </Group>
    </Group>
  );
};

export { Header };
