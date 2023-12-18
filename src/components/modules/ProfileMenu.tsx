import { Icon } from '@iconify/react';
import { Menu, Modal, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import { ChangePasswordForm } from '@/components/forms/ChangePasswordForm';
import { ProfileForm } from '@/components/forms/ProfileForm';
import { type GetOneUser } from '@/pages/api/users/[id]';

const ProfileMenu = () => {
  const [
    isProfileFormOpened,
    { open: openProfileForm, close: closeProfileForm },
  ] = useDisclosure(false);
  const [
    isChangePasswordFormOpened,
    { open: openChangePasswordForm, close: closeChangePasswordForm },
  ] = useDisclosure(false);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: userInfo } = useQuery({
    queryKey: ['users', userId],
    queryFn: async (): Promise<GetOneUser> => {
      const { data } = await axios.get(`/api/users/${userId}`);

      return data;
    },
    enabled: !!userId,
  });

  return (
    <>
      <Modal
        onClose={closeProfileForm}
        opened={isProfileFormOpened}
        title="Update profile"
      >
        <ProfileForm userId={userId} />
      </Modal>

      <Modal
        onClose={closeChangePasswordForm}
        opened={isChangePasswordFormOpened}
        title="Change password"
      >
        <ChangePasswordForm userId={userId} />
      </Modal>

      <Menu position="right-end">
        <Menu.Target>
          <NavLink
            className="rounded-md"
            description={userInfo?.email}
            label={userInfo?.name || 'User'}
            rightSection={
              <Icon
                height={18}
                icon="material-symbols:chevron-right-rounded"
                width={18}
              />
            }
          />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={
              <Icon
                height={18}
                icon="material-symbols:account-circle-outline"
                width={18}
              />
            }
            onClick={() => openProfileForm()}
          >
            Update profile
          </Menu.Item>
          <Menu.Item
            leftSection={
              <Icon
                height={18}
                icon="material-symbols:lock-outline"
                width={18}
              />
            }
            onClick={() => openChangePasswordForm()}
          >
            Change password
          </Menu.Item>
          <Menu.Item
            color="red"
            leftSection={
              <Icon
                height={18}
                icon="material-symbols:logout-rounded"
                width={18}
              />
            }
            onClick={() =>
              signOut({
                redirect: false,
                callbackUrl: '/auth/sign-in',
              })
            }
          >
            Sign out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export { ProfileMenu };
