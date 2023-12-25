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

  return <ChatController chatId={null} userId={userId as string} />;
};

export default ChatPage;
