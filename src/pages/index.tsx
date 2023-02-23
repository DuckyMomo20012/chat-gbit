import { Icon } from '@iconify/react';
import {
  ActionIcon,
  Badge,
  Button,
  Code,
  ColorSwatch,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import Head from 'next/head';
import { Counter } from '@/components/elements/Counter';
import { FeatureBox } from '@/components/elements/FeatureBox';

const techStack = [
  {
    name: 'Redux Toolkit',
    color: 'violet',
    docLink: 'https://redux-toolkit.js.org/',
    description: 'State management',
    logoSrc: '/img/redux.svg',
  },
  {
    name: 'React Router',
    color: 'red',
    docLink: 'https://reactrouter.com/en/main',
    description: 'Routing',
    logoSrc: '/img/react-router.svg',
  },
  {
    name: 'React Hook Form',
    color: 'pink',
    docLink: 'https://react-hook-form.com/',
    description: 'Forms',
    logoSrc: '/img/react-hook-form.svg',
  },
  {
    name: 'TanStack Query',
    color: 'orange',
    docLink: 'https://tanstack.com/query/v4',
    description: 'Data fetching',
    logoSrc: '/img/react-query.svg',
  },
  {
    name: 'Mantine',
    color: 'blue',
    docLink: 'https://mantine.dev/',
    description: 'UI library',
    logoSrc: '/img/mantine.svg',
  },
  {
    name: 'WindiCSS',
    color: 'sky',
    docLink: 'https://windicss.org/',
    description: 'CSS framework',
    logoSrc: '/img/windicss.svg',
  },
];

const HomePage = () => {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Stack align="center" py="xl">
      <Head>
        <title>NextJS + TS</title>
        <meta
          content="A simple starter template for NextJS + Typescript projects, with many useful features and tools pre-installed."
          name="description"
        ></meta>
      </Head>
      <Group className="w-full" position="center" spacing="xl">
        <Stack align="center">
          <Image
            alt="nextjs logo"
            className="hover:filter"
            fit="contain"
            height={80}
            imageProps={{
              style: {
                aspectRatio: '1 / 1',
              },
            }}
            src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png"
            style={
              {
                '--tw-drop-shadow': 'drop-shadow(0 0 2em #000000aa)',
              } as React.CSSProperties
            }
            width={80}
            withPlaceholder
          />
          <Title align="center" className="text-4xl">
            NextJS
          </Title>
        </Stack>
        <Icon height={36} icon="fluent-emoji-flat:plus" width={36} />
        <Stack align="center">
          <Image
            alt="typescript logo"
            className="hover:filter"
            fit="contain"
            height={80}
            imageProps={{
              style: {
                aspectRatio: '1 / 1',
              },
            }}
            src="/img/typescript.svg"
            style={
              {
                '--tw-drop-shadow': 'drop-shadow(0 0 2em #3178c6aa)',
              } as React.CSSProperties
            }
            width={80}
            withPlaceholder
          />
          <Title align="center" className="text-4xl">
            Typescript
          </Title>
        </Stack>
      </Group>

      <Title
        align="center"
        gradient={{
          from: dark ? 'white' : 'purple',
          to: dark ? 'pink' : 'cyan',
          deg: 45,
        }}
        order={2}
        variant="gradient"
      >
        Features
      </Title>

      <SimpleGrid
        breakpoints={[
          { minWidth: 'md', cols: 2 },
          { minWidth: 'lg', cols: 3 },
        ]}
        className="w-2/3 lg:auto-cols-min xl:auto-rows-fr"
        cols={1}
      >
        <FeatureBox
          color="indigo"
          outerClassName="col-span-1 md:col-span-2 lg:col-span-3"
        >
          <Stack align="center">
            <Title align="center" order={3}>
              <Icon
                height={22}
                icon="fluent-emoji-flat:high-voltage"
                inline
                style={{
                  aspectRatio: '1 / 1',
                }}
                width={22}
              />{' '}
              Batteries included
            </Title>
            <Group className="w-full" position="center" spacing="xl">
              {techStack.map(
                ({ name, color, docLink, description, logoSrc }) => {
                  return (
                    <Stack align="center" key={name}>
                      <Tooltip.Floating color={color} label={description}>
                        <ActionIcon
                          color={color}
                          component="a"
                          href={docLink || '#'}
                          size={64}
                          target="_blank"
                          variant="outline"
                        >
                          <Image
                            alt={`${name.toLowerCase()} logo`}
                            fit="contain"
                            height={36}
                            imageProps={{
                              style: {
                                aspectRatio: '1 / 1',
                              },
                            }}
                            src={logoSrc}
                            width={36}
                            withPlaceholder
                          />
                        </ActionIcon>
                      </Tooltip.Floating>
                      <Badge color={color}>{name}</Badge>
                    </Stack>
                  );
                },
              )}
            </Group>
          </Stack>
        </FeatureBox>

        <FeatureBox color="rose">
          <Stack align="center">
            <Title align="center" order={3}>
              <Icon
                height={22}
                icon="fluent-emoji-flat:sponge"
                inline
                style={{
                  aspectRatio: '1 / 1',
                }}
                width={22}
              />{' '}
              Better code style with
            </Title>
            <Group position="center">
              <Badge color="purple">ESlint</Badge>
              <Badge color="fuchsia">Prettier</Badge>
              <Badge color="slate">Husky</Badge>
              <Badge color="indigo">Commitlint</Badge>
              <Badge color="teal">Lint-staged</Badge>
              <Badge color="zinc">Editorconfig</Badge>
            </Group>
          </Stack>
        </FeatureBox>

        <FeatureBox color="pink">
          <Stack align="center">
            <Title align="center" order={3}>
              <Icon
                height={22}
                icon="fluent-emoji-flat:dizzy"
                inline
                style={{
                  aspectRatio: '1 / 1',
                }}
                width={22}
              />{' '}
              Move faster with these awesome libraries
            </Title>
            <Group position="center">
              <Badge className="animate-tada" color="yellow">
                Axios
              </Badge>
              <Badge className="animate-wobble" color="lime">
                Clsx
              </Badge>
              <Badge className="animate-swing" color="rose">
                Type-fest
              </Badge>
              <Badge className="animate-jello" color="cyan">
                Zod
              </Badge>
            </Group>
          </Stack>
        </FeatureBox>

        <FeatureBox color="teal">
          <Stack align="center">
            <Title align="center" order={3}>
              <Icon
                height={22}
                icon="fluent-emoji-flat:artist-palette"
                inline
                style={{
                  aspectRatio: '1 / 1',
                }}
                width={22}
              />{' '}
              Extended WindiCSS color palette
            </Title>
            <Group position="center">
              {Object.keys(theme.colors).map((color) => {
                return (
                  <Tooltip.Floating
                    className="capitalize"
                    color={color}
                    key={color}
                    label={color}
                  >
                    <ColorSwatch color={theme.colors[color][4]} radius="md" />
                  </Tooltip.Floating>
                );
              })}
            </Group>
          </Stack>
        </FeatureBox>

        <FeatureBox color="amber">
          <Stack align="center">
            <Title align="center" order={3}>
              <Icon
                height={22}
                icon={`fluent-emoji-flat:${
                  dark ? 'full-moon-face' : 'sun-with-face'
                }`}
                inline
                style={{
                  aspectRatio: '1 / 1',
                }}
                width={22}
              />{' '}
              Dark mode ready
            </Title>
            <Button
              data-test-id="demo-color-scheme-toggle"
              onClick={() => toggleColorScheme()}
              variant="light"
            >
              Toggle dark mode
            </Button>
          </Stack>
        </FeatureBox>

        <FeatureBox color="sky">
          <Stack align="center">
            <Title align="center" order={3}>
              <Icon
                height={22}
                icon="fluent-emoji-flat:input-latin-lowercase"
                inline
                style={{
                  aspectRatio: '1 / 1',
                }}
                width={22}
              />{' '}
              Pre-configured font pairing
            </Title>
            <Group position="center">
              <Text>Text: Inter</Text>
              <Title order={4}>Heading: Quicksand</Title>
              <Code color="violet">Mono: Space Mono</Code>
            </Group>
          </Stack>
        </FeatureBox>

        <FeatureBox color="gray">
          <Stack align="center">
            <Title align="center" order={3}>
              <Icon
                height={22}
                icon="fluent-emoji-flat:puzzle-piece"
                inline
                style={{
                  aspectRatio: '1 / 1',
                }}
                width={22}
              />{' '}
              Simple Redux integration
            </Title>
            <Counter />
          </Stack>
        </FeatureBox>
      </SimpleGrid>
    </Stack>
  );
};

export default HomePage;
