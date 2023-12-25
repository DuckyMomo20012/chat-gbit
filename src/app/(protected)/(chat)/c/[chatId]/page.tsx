import { Stack } from '@mantine/core';
import { type Metadata } from 'next';
import { getOneChat } from '@/app/api/users/[userId]/chat/[chatId]/route';
import { ChatController } from '@/components/modules/ChatController';
import { auth } from '@/lib/auth';

export const generateMetadata = async ({
  params,
}: {
  params: { chatId: string };
}): Promise<Metadata> => {
  const session = await auth();
  const userId = session?.user?.id;

  try {
    const chat = await getOneChat(userId as string, params.chatId);

    return {
      title: chat.title,
      description: chat.title,
    };
  } catch (err) {
    return {
      title: 'Chat GBiT',
      description: 'Create new chat',
    };
  }
};

const ChatPage = async ({ params }: { params: { chatId: string } }) => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <Stack className="relative h-[calc(100dvh_-_var(--app-shell-header-offset)_-_var(--app-shell-footer-offset)_-_var(--app-shell-padding)_*_2)]">
      <ChatController chatId={params.chatId} userId={userId as string} />
    </Stack>
  );
};

export default ChatPage;
