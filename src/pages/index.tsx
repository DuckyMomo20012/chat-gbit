import { Icon } from '@iconify/react';
import { ActionIcon, Space, Stack, Text, TextInput } from '@mantine/core';
import Head from 'next/head';
import { Convo } from '@/components/elements/Convo';

const HomePage = () => {
  return (
    <Stack
      align="center"
      className="h-[calc(100vh-var(--mantine-header-height)-var(--mantine-footer-height))] relative w-full overflow-hidden"
    >
      <Head>
        <title>New Chat</title>
        <meta content="Create new Chat GBiT" name="description"></meta>
      </Head>

      <Stack className="w-full relative overflow-y-auto">
        <Convo />
        <Space className="w-full h-32 md:h-48 flex-shrink-0" />
      </Stack>

      <Stack className="absolute bottom-0 w-full">
        <ActionIcon
          className="self-end mr-8"
          color="indigo"
          radius="xl"
          size="lg"
          variant="light"
        >
          <Icon height={24} icon="ic:outline-arrow-circle-down" width={24} />
        </ActionIcon>
        <Stack align="center" className="dark:bg-black bg-white p-4">
          <TextInput
            className="w-full md:w-1/2"
            rightSection={<Icon height={24} icon="ic:outline-send" />}
            size="lg"
          />
          <Text align="center" color="dimmed" fz="sm">
            This program is designed for testing ChatGPT API only.
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default HomePage;
