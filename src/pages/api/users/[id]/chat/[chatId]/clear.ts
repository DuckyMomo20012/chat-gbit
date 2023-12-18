import { type NextApiRequest, type NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export const clearChat = async (userId: string, chatId: string) => {
  return prisma.chat.update({
    where: { id: chatId as string, userId: userId as string },
    data: {
      messages: {
        deleteMany: {},
      },
    },
  });
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: userId, chatId } = req.query;

  if (!userId || !chatId) {
    return res.status(400).json({ error: 'Bad request' });
  }

  switch (req.method) {
    case 'POST': {
      try {
        const result = await clearChat(userId as string, chatId as string);

        return res.status(200).json(result);
      } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    default: {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  }
}

export default handler;
