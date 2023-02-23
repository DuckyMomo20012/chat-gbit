import { Icon } from '@iconify/react';
import {
  Center,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const AuthGuard = ({ children }: { children?: React.ReactNode }) => {
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const { status } = useSession();
  // Set this to true will redirect directly
  // required: true,
  // onUnauthenticated() {
  //   router.push('/auth/login');
  // },

  useEffect(() => {
    if (status !== 'loading') {
      setOpened(true);
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <Center className="h-full w-full">
        <Stack>
          <Text>Loading user...</Text>
          <Center>
            <Loader className="h-48px w-48px" />
          </Center>
        </Stack>
      </Center>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <>
        <Modal
          onClose={() => {
            setOpened(false);
            router.push('/auth/login');
          }}
          opened={opened}
          withCloseButton={false}
        >
          <Group>
            <ThemeIcon color="red" radius="xl" size="xl" variant="light">
              <Icon icon="ic:baseline-error-outline" width="24" />
            </ThemeIcon>
            <Text>You are not logged in</Text>
          </Group>
        </Modal>
      </>
    );
  }
  if (status === 'authenticated') {
    return <>{children}</>;
  }

  return <>{children}</>;
};

export { AuthGuard };
