import { Icon } from '@iconify/react';
import {
  ActionIcon,
  Anchor,
  Avatar,
  Group,
  Image,
  Text,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Settings } from '@/components/modules/Settings';

const items = [
  {
    path: '/',
    label: 'Home',
    color: 'indigo',
    icon: 'material-symbols:home',
  },
];

const Header = () => {
  const router = useRouter();

  const { slug } = router.query;
  const id = slug?.at(0);

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const queryClient = useQueryClient();

  const { mutate: clearConversation } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(`/api/conversations/${id}/clear`);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['conversations', router.query.slug],
      });
    },
  });

  return (
    <Group className="h-full w-full px-4">
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
        {id && (
          <Tooltip label="Clear conversation">
            <ActionIcon
              aria-label="Clear conversation"
              color="red"
              onClick={() => clearConversation()}
              size="lg"
              variant="outline"
            >
              <Icon icon="material-symbols:delete-outline" width={24} />
            </ActionIcon>
          </Tooltip>
        )}

        <Settings />

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
