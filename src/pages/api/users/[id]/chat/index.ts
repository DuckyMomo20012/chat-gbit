import { Prisma } from '@prisma/client';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';

export const chatBodySchema = z.object({
  title: z.string().min(1).max(191),
});

export const getChat = async (userId: string) => {
  return prisma.chat.findMany({
    where: { userId },
  });
};

export const createChat = async (
  userId: string,
  data: Prisma.ChatUncheckedCreateWithoutUserInput,
) => {
  return prisma.chat.create({
    data: {
      ...data,
      user: {
        connect: { id: userId },
      },
    },
  });
};

export type GetChat = Prisma.PromiseReturnType<typeof getChat>;
export type CreateChat = Prisma.PromiseReturnType<typeof createChat>;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Bad request' });
  }

  switch (req.method) {
    case 'GET': {
      try {
        const result = await getChat(id as string);

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
        const parsedBody = chatBodySchema.parse(req.body);

        const result = await createChat(id as string, parsedBody);

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
