import { Icon } from '@iconify/react';
import { ActionIcon, Button, Menu, NavLink } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { NavPath } from '@/types/NavPath';

const DEFAULT_ICON_HEIGHT = 18;
const DEFAULT_ITEM_HEIGHT = 36;

const NavMenuListDropdown = ({
  paths,
  level,
  count = 0,
}: {
  paths: NavPath[];
  level: number;
  count?: number;
}) => {
  const router = useRouter();

  return (
    <>
      {paths.map((path, index) => {
        const continueLevel = count < level && !!path.subPath;
        const isActive = router.pathname === path.path;

        const DEFAULT_PROPS = {
          active: isActive,
          color: path.color,
          component: Link,
          icon: path.icon && (
            <Icon
              height={DEFAULT_ICON_HEIGHT}
              icon={path.icon}
              width={DEFAULT_ICON_HEIGHT}
            />
          ),
          label: path.label,
          style: { height: DEFAULT_ITEM_HEIGHT },
          href: path.path,
          variant: 'light' as const,
        };

        if (continueLevel) {
          return (
            <Menu
              key={`${index}-${count}`}
              position="right-start"
              trigger="hover"
              withinPortal
            >
              <Menu.Target>
                <NavLink
                  rightSection={
                    <Icon
                      height={DEFAULT_ICON_HEIGHT}
                      icon="ic:outline-chevron-right"
                      inline
                    />
                  }
                  {...DEFAULT_PROPS}
                />
              </Menu.Target>

              <Menu.Dropdown>
                <NavMenuListDropdown
                  count={count + 1}
                  level={level}
                  paths={path.subPath}
                />
              </Menu.Dropdown>
            </Menu>
          );
        }

        // NOTE: Menu Item is wrapped with a Menu to prevent hover problem,
        // maybe Menu Context conflicted when it's nested
        return (
          <Menu key={`${index}-${count}`}>
            <NavLink {...DEFAULT_PROPS} />
          </Menu>
        );
      })}
    </>
  );
};

const NavMenuList = ({
  paths,
  level,
  count = 0,
}: {
  paths: NavPath[];
  level: number;
  count?: number;
}) => {
  const router = useRouter();

  return (
    <>
      {paths.map((path, index) => {
        const isActive = router.pathname === path.path;

        return (
          <Menu key={`${index}-${count}`} trigger="hover" withinPortal>
            <Menu.Target>
              <Button
                color={path.color}
                component={Link}
                href={path.path}
                leftIcon={
                  path.icon && (
                    <Icon
                      height={DEFAULT_ICON_HEIGHT}
                      icon={path.icon}
                      width={DEFAULT_ICON_HEIGHT}
                    />
                  )
                }
                rightIcon={
                  path.subPath && (
                    <Icon
                      height={DEFAULT_ICON_HEIGHT}
                      icon="ic:outline-expand-more"
                      width={DEFAULT_ICON_HEIGHT}
                    />
                  )
                }
                variant={isActive ? 'light' : 'subtle'}
              >
                {path.label}
              </Button>
            </Menu.Target>

            {/* NOTE: Have to check here to prevent empty dropdown */}
            {path.subPath && (
              <Menu.Dropdown>
                <NavMenuListDropdown
                  count={count + 1}
                  level={level}
                  paths={path.subPath}
                />
              </Menu.Dropdown>
            )}
          </Menu>
        );
      })}
    </>
  );
};

const NavMenuListCompact = ({
  paths,
  level,
  count = 0,
}: {
  paths: NavPath[];
  level: number;
  count?: number;
}) => {
  return (
    <Menu position="bottom-start" trigger="hover" withinPortal>
      <Menu.Target>
        <ActionIcon size={36} variant="light">
          <Icon
            height={DEFAULT_ICON_HEIGHT}
            icon="ic:baseline-more-vert"
            width={DEFAULT_ICON_HEIGHT}
          />
        </ActionIcon>
      </Menu.Target>

      {/* NOTE: Have to check here to prevent empty dropdown */}
      {paths.length > 0 && (
        <Menu.Dropdown>
          <NavMenuListDropdown count={count} level={level} paths={paths} />
        </Menu.Dropdown>
      )}
    </Menu>
  );
};

export { NavMenuList, NavMenuListCompact };
