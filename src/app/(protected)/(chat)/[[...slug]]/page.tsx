import { Stack } from '@mantine/core';
import { ChatController } from '@/components/modules/ChatController';

const HomePage = () => {
  return (
    <Stack className="relative h-[calc(100dvh_-_var(--app-shell-header-offset)_-_var(--app-shell-footer-offset)_-_var(--app-shell-padding)_*_2)]">
      <ChatController />
    </Stack>
  );
};

export default HomePage;
