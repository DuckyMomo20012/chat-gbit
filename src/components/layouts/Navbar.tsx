import { ScrollArea, Stack } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ConvoMenu } from '../modules/ConvoMenu';

const Navbar = () => {
  const router = useRouter();

  const { slug } = router.query;
  const id = slug?.at(0);

  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await axios.get('/api/conversations');

      return data;
    },
  });

  return (
    <Stack className="h-full">
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
