import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCallback } from 'react';

const useChatId = () => {
  const router = useRouter();
  const { chatId } = useParams<{ chatId: string }>();

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const getId = useCallback(async (): Promise<string> => {
    if (!chatId) {
      const { data } = await axios.post(`/api/users/${userId}/chat`, {
        title: 'Untitled',
      });

      router.push(`/c/${data.id}`);

      return data.id;
    }

    return chatId;
  }, [userId, chatId, router]);

  return { getId };
};

export { useChatId };
