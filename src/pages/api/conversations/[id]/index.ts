import { type NextApiRequest, type NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { conversationBodySchema } from '@/pages/api/conversations/index';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  switch (req.method) {
    case 'GET': {
      try {
        const result = await prisma.conversation.findUniqueOrThrow({
          where: { id: id as string },
          include: {
            messages: true,
          },
        });

        return res.status(200).json(result);
      } catch (err) {
        return res.status(404).json({ error: 'Not found' });
      }
    }

    case 'PATCH': {
      try {
        const parsedBody = conversationBodySchema.partial().parse(req.body);

        const result = await prisma.conversation.update({
          where: { id: id as string },
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
          where: { id: id as string },
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
