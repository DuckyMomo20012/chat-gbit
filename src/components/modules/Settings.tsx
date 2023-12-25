'use client';

import { Icon } from '@iconify/react';
import { ActionIcon, Modal, Stack, Text, Title, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ModelForm } from '@/components/forms/ModelForm';
import { UploadForm } from '@/components/forms/UploadForm';

const Settings = ({
  userId,
  chatId,
}: {
  userId: string;
  chatId: string | null;
}) => {
  const [isSettingOpen, { open: openSetting, close: closeSetting }] =
    useDisclosure(false);

  return (
    <>
      <Modal
        centered
        closeOnClickOutside={false}
        onClose={closeSetting}
        opened={isSettingOpen}
        size="lg"
        title="Settings"
      >
        <Stack>
          <Stack>
            <Stack gap={0}>
              <Title order={3}>Models</Title>

              <Text c="gray">(All chat)</Text>
            </Stack>

            <ModelForm />
          </Stack>

          <Stack>
            <Stack gap={0}>
              <Title order={3}>Training</Title>

              <Text c="gray">(Current chat only)</Text>
            </Stack>
            <UploadForm chatId={chatId} userId={userId} />
          </Stack>
        </Stack>
      </Modal>

      <Tooltip label="Settings" position="bottom">
        <ActionIcon
          aria-label="Train"
          color="indigo"
          onClick={openSetting}
          size="lg"
          variant="outline"
        >
          <Icon icon="material-symbols:settings-outline-rounded" width={24} />
        </ActionIcon>
      </Tooltip>
    </>
  );
};

export { Settings };
