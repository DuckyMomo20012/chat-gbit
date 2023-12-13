import { Icon } from '@iconify/react';
import { ActionIcon, Menu, NavLink, ScrollArea, Stack } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
              <NavLink
                active={conversation.id === id}
                className="rounded-md"
                component={Link}
                href={`/${conversation.id}`}
                key={conversation.id}
                label={conversation.title}
                rightSection={
                  <Menu position="bottom-start">
                    <Menu.Target>
                      <ActionIcon
                        color="gray"
                        onClick={(e) => e.preventDefault()}
                        variant="subtle"
                      >
                        <Icon
                          height={16}
                          icon="material-symbols:more-horiz"
                          width={16}
                        />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={
                          <Icon
                            height={16}
                            icon="material-symbols:edit-square-outline-rounded"
                            width={16}
                          />
                        }
                        variant="subtle"
                      >
                        Rename
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        leftSection={
                          <Icon
                            height={16}
                            icon="material-symbols:delete-outline-rounded"
                            width={16}
                          />
                        }
                        variant="subtle"
                      >
                        Delete chat
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                }
                variant="light"
              />
            );
          })}
      </ScrollArea>
    </Stack>
  );
};

export { Navbar };
