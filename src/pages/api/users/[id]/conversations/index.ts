import { Prisma } from '@prisma/client';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';

export const conversationBodySchema = z.object({
  title: z.string().min(1).max(191),
});

export const getConversations = async (userId: string) => {
  return prisma.conversation.findMany({
    where: { userId },
  });
};

export const createConversation = async (
  userId: string,
  data: Prisma.ConversationUncheckedCreateWithoutUserInput,
) => {
  return prisma.conversation.create({
    data: {
      ...data,
      User: {
        connect: { id: userId },
      },
    },
  });
};

export type GetConversations = Prisma.PromiseReturnType<
  typeof getConversations
>;
export type CreateConversation = Prisma.PromiseReturnType<
  typeof createConversation
>;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Bad request' });
  }

  switch (req.method) {
    case 'GET': {
      try {
        const result = await getConversations(id as string);

        return res.status(200).json(result);
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({ error: 'Bad request' });
        }

        return res.status(404).json({ error: 'Not found' });
      }
    }

    case 'POST': {
      try {
        const parsedBody = conversationBodySchema.parse(req.body);

        const result = await createConversation(id as string, parsedBody);

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
