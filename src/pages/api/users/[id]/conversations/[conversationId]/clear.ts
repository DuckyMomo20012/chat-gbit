import { type NextApiRequest, type NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: userId, conversationId } = req.query;

  if (!userId || !conversationId) {
    return res.status(400).json({ error: 'Bad request' });
  }

  switch (req.method) {
    case 'POST': {
      try {
        const result = await prisma.conversation.update({
          where: { id: conversationId as string, userId: userId as string },
          data: {
            messages: {
              deleteMany: {},
            },
          },
        });

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
