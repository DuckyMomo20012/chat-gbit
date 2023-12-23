import { Prisma } from '@prisma/client';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { chatBodySchema } from '@/pages/api/users/[userId]/chat/index';

export const getOneChat = async (userId: string, chatId: string) => {
  return prisma.chat.findUniqueOrThrow({
    where: { id: chatId, userId },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
};

export const updateChat = async (
  userId: string,
  chatId: string,
  data: Prisma.ChatUncheckedUpdateManyWithoutUserInput,
) => {
  return prisma.chat.update({
    where: { id: chatId, userId },
    data,
  });
};

export const deleteChat = async (userId: string, chatId: string) => {
  return prisma.chat.delete({
    where: { id: chatId, userId },
  });
};

export type GetOneChat = Prisma.PromiseReturnType<typeof getOneChat>;
export type UpdateChat = Prisma.PromiseReturnType<typeof updateChat>;
export type DeleteChat = Prisma.PromiseReturnType<typeof deleteChat>;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, chatId } = req.query;

  if (!userId || !chatId) {
    return res.status(400).json({ error: 'Bad request' });
  }

  switch (req.method) {
    case 'GET': {
      try {
        const result = await getOneChat(userId as string, chatId as string);

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
        const parsedBody = chatBodySchema.parse(req.body);

        const result = await updateChat(
          userId as string,
          chatId as string,
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
        const result = await deleteChat(userId as string, chatId as string);

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
