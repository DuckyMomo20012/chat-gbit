import { Icon } from '@iconify/react';
import {
  ActionIcon,
  Anchor,
  Avatar,
  Button,
  CloseButton,
  Divider,
  Group,
  Image,
  Navbar as MantineNavbar,
  ScrollArea,
  Text,
  Tooltip,
  Transition,
  useMantineColorScheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import { useEffect } from 'react';
import { NavLinkList } from '@/components/elements/NavLinkList';
import { navBarItems } from '@/components/layouts/navBarItems';

type NavbarProps = {
  navBarOpened: boolean;
  setNavBarOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

const slideRight = {
  in: { opacity: 1, transform: 'translateX(0)' },
  out: { opacity: 0, transform: 'translateX(-100%)' },
  transitionProperty: 'transform, opacity',
};

const Navbar = ({ navBarOpened, setNavBarOpened }: NavbarProps) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const matches = useMediaQuery('(min-width: 640px)');

  useEffect(() => {
    if (navBarOpened) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [navBarOpened]);

  useEffect(() => {
    if (matches) {
      setNavBarOpened(false);
    }
  }, [matches, setNavBarOpened]);

  return (
    <Transition
      duration={0}
      mounted={navBarOpened}
      timingFunction="ease-in-out"
      transition={slideRight}
    >
      {(styles) => {
        return (
          <MantineNavbar
            // hiddenBreakpoint="sm"
            // NOTE: Don't set this because we want animation to work
            // Hidden={!navBarOpened}
            className="!sm:hidden !w-9/10 !z-200 !top-0 h-full shadow-md rounded-r-lg"
            style={styles}
          >
            <MantineNavbar.Section
              className="flex items-center justify-between gap-2"
              p="sm"
            >
              <Group className="min-w-0" noWrap>
                <Anchor
                  className="flex min-w-0 items-center gap-2"
                  component={Link}
                  href="/"
                  underline={false}
                >
                  <Avatar color="indigo" radius="sm" size="md" variant="filled">
                    <Image
                      alt="logo"
                      height={28}
                      src="/img/chatgpt.svg"
                      width={28}
                    />
                  </Avatar>
                  <Text align="center" className="w-full truncate" fw={700}>
                    Chat GBiT
                  </Text>
                </Anchor>
                <Tooltip label={dark ? 'Light mode' : 'Dark mode'}>
                  <ActionIcon
                    aria-label="Toggle color scheme"
                    color="blue"
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
              </Group>
              <CloseButton
                aria-label="Close navigation menu"
                onClick={() => setNavBarOpened(false)}
                size="xl"
              />
            </MantineNavbar.Section>
            <MantineNavbar.Section component={ScrollArea} grow>
              <NavLinkList
                count={0}
                handleClick={() => setNavBarOpened(false)}
                level={2}
                paths={navBarItems}
              />
            </MantineNavbar.Section>
            <Divider />
            <MantineNavbar.Section p="sm">
              <Group position="center">
                <Button
                  component="a"
                  href="https://github.com/DuckyMomo20012/chat-gbit"
                  leftIcon={<Icon icon="ant-design:github-filled" width={24} />}
                  target="_blank"
                  variant="light"
                >
                  Github
                </Button>
              </Group>
            </MantineNavbar.Section>
          </MantineNavbar>
        );
      }}
    </Transition>
  );
};

export { Navbar };
