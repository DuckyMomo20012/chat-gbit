import { Stack } from '@mantine/core';
import { AppShell } from '@/components/layouts/AppShell';
import { ChatLayout } from '@/components/layouts/ChatLayout';

const ChatPageLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <AppShell withNavbar>
      <ChatLayout>
        <Stack className="relative h-[calc(100dvh_-_var(--app-shell-header-offset)_-_var(--app-shell-footer-offset)_-_var(--app-shell-padding)_*_2)]">
          {children}
        </Stack>
      </ChatLayout>
    </AppShell>
  );
};

export default ChatPageLayout;
