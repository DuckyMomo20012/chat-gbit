import { type NextApiRequest, type NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';

export const conversationBodySchema = z.object({
  title: z.string().min(1).max(191),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      const result = await prisma.conversation.findMany();

      return res.status(200).json(result);
    }

    case 'POST': {
      try {
        const parsedBody = conversationBodySchema.parse(req.body);

        const result = await prisma.conversation.create({
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

    default: {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  }
}

export default handler;
