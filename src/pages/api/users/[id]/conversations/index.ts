import { type NextApiRequest, type NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';

export const conversationBodySchema = z.object({
  title: z.string().min(1).max(191),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Bad request' });
  }

  switch (req.method) {
    case 'GET': {
      try {
        const result = await prisma.conversation.findMany({
          where: { userId: id as string },
        });

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

        const result = await prisma.conversation.create({
          data: {
            ...parsedBody,
            userId: id as string,
          },
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
