import { Icon } from '@iconify/react';
import { NavLink, ScrollArea, Stack, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ConvoMenu } from '@/components/modules/ConvoMenu';
import { ProfileMenu } from '@/components/modules/ProfileMenu';
import { type GetChat } from '@/pages/api/users/[userId]/chat';

const Navbar = () => {
  const router = useRouter();

  const id = router.query.slug?.at(0);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: chat } = useQuery({
    queryKey: ['users', userId, 'chat'],
    queryFn: async (): Promise<GetChat> => {
      const { data } = await axios.get(`/api/users/${userId}/chat`);

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

      <ScrollArea className="h-full p-4">
        {chat
          ?.sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          })
          ?.map((c: { id: string; title: string }) => {
            return (
              <ConvoMenu
                active={c.id === id}
                id={c.id}
                key={c.id}
                label={c.title}
              />
            );
          })}
      </ScrollArea>

      <Stack className="px-4 pb-4">
        <ProfileMenu />
      </Stack>
    </Stack>
  );
};

export { Navbar };
