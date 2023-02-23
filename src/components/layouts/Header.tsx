import { Icon } from '@iconify/react';
import {
  ActionIcon,
  Anchor,
  Group,
  Image,
  Header as MantineHeader,
  Text,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import Link from 'next/link';
import { useEffect, useReducer, useState } from 'react';
import {
  NavMenuList,
  NavMenuListCompact,
} from '@/components/elements/NavMenuList';
import { navBarItems as defaultNavBarItems } from '@/components/layouts/navBarItems';
import { NavPath } from '@/types/NavPath';

type HeaderProps = {
  setNavBarOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

type NavItemState = {
  items: NavPath[];
  hiddenItems: NavPath[];
  oversizeWidth: number[];
};

type NavItemAction =
  | {
      type: 'hide';
      payload?: number;
    }
  | {
      type: 'restore';
    };

function reducer(state: NavItemState, action: NavItemAction) {
  switch (action.type) {
    case 'hide': {
      return {
        ...state,
        items: [...state.items.slice(0, -1)],
        hiddenItems: [...state.items.slice(-1), ...state.hiddenItems],
        oversizeWidth: [action.payload, ...state.oversizeWidth],
      };
    }

    case 'restore': {
      return {
        ...state,
        items: [...state.items, ...state.hiddenItems.slice(0, 1)],
        hiddenItems: [...state.hiddenItems.slice(1)],
        oversizeWidth: [...state.oversizeWidth.slice(1)],
      };
    }

    default:
      return state;
  }
}

const Header = ({ setNavBarOpened }: HeaderProps) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const [itemState, dispatch] = useReducer(reducer, {
    items: defaultNavBarItems,
    hiddenItems: [],
    oversizeWidth: [],
  });

  const { ref: containerRef, width: containerWidth } = useElementSize();
  const { ref: childrenRef, width: childrenWidth } = useElementSize();

  const [hidden, setHidden] = useState(true);

  const hiddenStyles = {
    height: 0,
    overflow: 'hidden',
  };

  useEffect(() => {
    if (childrenWidth > containerWidth) {
      dispatch({
        type: 'hide',
        payload: childrenWidth,
      });
    }
  }, [containerWidth, childrenWidth]);

  useEffect(() => {
    if (itemState.oversizeWidth.at(0) < containerWidth) {
      dispatch({
        type: 'restore',
      });
    }

    if (childrenWidth < containerWidth) {
      setHidden(false);
    }
  }, [itemState, childrenWidth, containerWidth]);

  return (
    <MantineHeader height={48} px={24}>
      <Group className="h-full" noWrap position="apart">
        <ActionIcon
          aria-label="Open navigation menu"
          className="sm:hidden"
          onClick={() => {
            setNavBarOpened((prevNavBarOpened) => !prevNavBarOpened);
          }}
          size="lg"
          variant="subtle"
        >
          <Icon height={24} icon="ic:baseline-menu" width={24} />
        </ActionIcon>

        <Group className="sm:flex hidden" position="left">
          <Anchor
            className="flex items-center gap-2 whitespace-nowrap"
            component={Link}
            href="/"
            underline={false}
          >
            <Image
              alt="logo"
              height={32}
              src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png"
              width={32}
            />
            <Text align="center" fw={700}>
              NextJS Template
            </Text>
          </Anchor>
        </Group>

        <Group className="sm:flex hidden flex-grow h-full">
          <Group
            className="h-full relative flex-grow overflow-hidden"
            ref={containerRef}
          >
            <Group
              className="h-full absolute"
              noWrap
              ref={childrenRef}
              style={{ ...(hidden && hiddenStyles) }}
            >
              <NavMenuList level={3} paths={itemState.items} />
              {itemState.hiddenItems.length > 0 && (
                <NavMenuListCompact level={3} paths={itemState.hiddenItems} />
              )}
            </Group>
          </Group>
        </Group>

        <Group noWrap>
          <Tooltip label={dark ? 'Light mode' : 'Dark mode'}>
            <ActionIcon
              aria-label="Toggle color scheme"
              className="sm:flex hidden"
              color="blue"
              data-test-id="color-scheme-toggle"
              onClick={() => toggleColorScheme()}
              size="lg"
              variant="outline"
            >
              <Icon
                icon={dark ? 'ic:outline-dark-mode' : 'ic:outline-light-mode'}
                width={24}
              />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Source code">
            <Anchor
              data-test-id="github-link"
              href="https://github.com/DuckyMomo20012/nextjs-template"
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
    </MantineHeader>
  );
};

export { Header };
