import { Prisma } from '@prisma/client';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { conversationBodySchema } from '@/pages/api/users/[id]/chat/index';

export const getOneConversation = async (
  userId: string,
  conversationId: string,
) => {
  return prisma.conversation.findUniqueOrThrow({
    where: { id: conversationId, userId },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
};

export const updateConversation = async (
  userId: string,
  conversationId: string,
  data: Prisma.ConversationUncheckedUpdateManyWithoutUserInput,
) => {
  return prisma.conversation.update({
    where: { id: conversationId, userId },
    data,
  });
};

export const deleteConversation = async (
  userId: string,
  conversationId: string,
) => {
  return prisma.conversation.delete({
    where: { id: conversationId, userId },
  });
};

export type GetOneConversation = Prisma.PromiseReturnType<
  typeof getOneConversation
>;
export type UpdateConversation = Prisma.PromiseReturnType<
  typeof updateConversation
>;
export type DeleteConversation = Prisma.PromiseReturnType<
  typeof deleteConversation
>;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: userId, conversationId } = req.query;

  if (!userId || !conversationId) {
    return res.status(400).json({ error: 'Bad request' });
  }

  switch (req.method) {
    case 'GET': {
      try {
        const result = await getOneConversation(
          userId as string,
          conversationId as string,
        );

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

        const result = await updateConversation(
          userId as string,
          conversationId as string,
          parsedBody,
        );

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
        const result = await deleteConversation(
          userId as string,
          conversationId as string,
        );

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
