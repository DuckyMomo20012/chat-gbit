import { type Metadata } from 'next';
import { getOneChat } from '@/app/api/users/[userId]/chat/service';
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

  return <ChatController chatId={params.chatId} userId={userId as string} />;
};

export default ChatPage;
