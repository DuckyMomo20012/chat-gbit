import { type NextApiRequest, type NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { conversationBodySchema } from '@/pages/api/users/[id]/conversations/index';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: userId, conversationId } = req.query;

  if (!userId || !conversationId) {
    return res.status(400).json({ error: 'Bad request' });
  }

  switch (req.method) {
    case 'GET': {
      try {
        const result = await prisma.conversation.findUniqueOrThrow({
          where: { id: conversationId as string, userId: userId as string },
          include: {
            messages: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        });

        return res.status(200).json(result);
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({ error: 'Bad request' });
        }

        return res.status(404).json({ error: 'Not found' });
      }
    }

    case 'PATCH': {
      try {
        const parsedBody = conversationBodySchema.parse(req.body);

        const result = await prisma.conversation.update({
          where: { id: conversationId as string, userId: userId as string },
          data: parsedBody,
        });

        return res.status(200).json(result);
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({ error: 'Bad request' });
        }

        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    case 'DELETE': {
      try {
        const result = await prisma.conversation.delete({
          where: { id: conversationId as string, userId: userId as string },
        });

        return res.status(200).json(result);
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({ error: 'Bad request' });
        }

        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    default: {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  }
}

export default handler;
