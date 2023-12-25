import { Stack } from '@mantine/core';
import { type Metadata } from 'next';
import { getOneChat } from '@/app/api/users/[userId]/chat/[chatId]/route';
import { ChatController } from '@/components/modules/ChatController';
import { auth } from '@/lib/auth';

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> => {
  const session = await auth();
  const userId = session?.user?.id;
  const chatId = params?.slug?.at(0);

  try {
    const chat = await getOneChat(userId as string, chatId as string);

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

const HomePage = () => {
  return (
    <Stack className="relative h-[calc(100dvh_-_var(--app-shell-header-offset)_-_var(--app-shell-footer-offset)_-_var(--app-shell-padding)_*_2)]">
      <ChatController />
    </Stack>
  );
};

export default HomePage;
