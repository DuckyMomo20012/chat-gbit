import { Icon } from '@iconify/react';
import { ActionIcon, Modal, Stack, Text, Title, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ModelForm } from '@/components/modules/ModelForm';
import { UploadForm } from '@/components/modules/UploadForm';

const Settings = () => {
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

              <Text c="gray">(All conversations)</Text>
            </Stack>

            <ModelForm />
          </Stack>

          <Stack>
            <Stack gap={0}>
              <Title order={3}>Training</Title>

              <Text c="gray">(Current conversation only)</Text>
            </Stack>
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

export { Settings };
