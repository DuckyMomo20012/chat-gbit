import { Icon } from '@iconify/react';
import { ActionIcon, Modal, Stack, Title, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ModelForm } from '@/components/modules/ModelForm';
import { UploadForm } from '@/components/modules/UploadForm';

const ChatToolbar = () => {
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
            <Title order={3}>Models</Title>

            <ModelForm />
          </Stack>

          <Stack>
            <Title order={3}>Training</Title>
            <UploadForm />
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

export { ChatToolbar };
