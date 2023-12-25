import { Stack } from '@mantine/core';
import { type Metadata } from 'next';
import { ChatController } from '@/components/modules/ChatController';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Chat GBiT',
  description: 'Create new chat',
};

const ChatPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <Stack className="relative h-[calc(100dvh_-_var(--app-shell-header-offset)_-_var(--app-shell-footer-offset)_-_var(--app-shell-padding)_*_2)]">
      <ChatController chatId={null} userId={userId as string} />
    </Stack>
  );
};

export default ChatPage;
