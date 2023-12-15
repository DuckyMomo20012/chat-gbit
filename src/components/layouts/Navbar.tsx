import { Icon } from '@iconify/react';
import { NavLink, ScrollArea, Stack, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ConvoMenu } from '../modules/ConvoMenu';

const Navbar = () => {
  const router = useRouter();

  const { slug } = router.query;
  const id = slug?.at(0);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: conversations } = useQuery({
    queryKey: ['conversations', userId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${userId}/conversations`);

      return data;
    },
  });

  return (
    <Stack className="h-full">
      <Stack className="px-4 pt-4">
        <NavLink
          active
          className="rounded-md"
          component={Link}
          href="/"
          label={<Text>New chat</Text>}
          rightSection={
            <Icon
              height={24}
              icon="material-symbols:chat-outline-rounded"
              width={24}
            />
          }
          variant="filled"
        />
      </Stack>

      <ScrollArea className="p-4">
        {conversations
          ?.sort((a: { createdAt: string }, b: { createdAt: string }) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          })
          ?.map((conversation: { id: string; title: string }) => {
            return (
              <ConvoMenu
                active={conversation.id === id}
                id={conversation.id}
                key={conversation.id}
                label={conversation.title}
              />
            );
          })}
      </ScrollArea>
    </Stack>
  );
};

export { Navbar };
