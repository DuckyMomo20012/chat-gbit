import { Icon } from '@iconify/react';
import { ActionIcon, Menu, Modal, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ConvoForm } from '../forms/ConvoForm';

const ConvoMenu = ({
  id,
  label,
  active,
}: {
  id: string;
  label: string;
  active: boolean;
}) => {
  const [isFormOpened, { open: openForm, close: closeForm }] =
    useDisclosure(false);

  const router = useRouter();

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const queryClient = useQueryClient();

  const { mutate: deleteChat } = useMutation({
    mutationFn: async ({ chatId }: { chatId: string }) => {
      const { data } = await axios.delete(
        `/api/users/${userId}/chat/${chatId}`,
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chat', userId],
        // NOTE: We need to invalidate exact queryKey to make sure that we don't
        // invalidate the deleted chat query.
        exact: true,
      });

      router.push('/');
    },
  });
  return (
    <>
      <Modal onClose={closeForm} opened={isFormOpened} title="Edit chat">
        <ConvoForm chatId={id} />
      </Modal>

      <NavLink
        active={active}
        className="rounded-md"
        component={Link}
        href={`/${id}`}
        label={label}
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
                onClick={(e) => {
                  e.stopPropagation();

                  openForm();
                }}
                variant="subtle"
              >
                Edit
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
                onClick={(e) => {
                  e.stopPropagation();

                  deleteChat({
                    chatId: id,
                  });
                }}
                variant="subtle"
              >
                Delete chat
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        }
        variant="light"
      />
    </>
  );
};

export { ConvoMenu };
