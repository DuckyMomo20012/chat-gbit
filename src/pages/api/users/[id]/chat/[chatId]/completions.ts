import { type NextApiRequest, type NextApiResponse } from 'next';
import { z } from 'zod';
import { getCompletions } from '@/lib/openai';
import prisma from '@/lib/prisma';
import { getOneConversation } from '@/pages/api/users/[id]/chat/[conversationId]';

export const completionBodySchema = z.object({
  model: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
    }),
  ),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: userId, conversationId } = req.query;

  if (!userId || !conversationId) {
    return res.status(400).json({ error: 'Bad request' });
  }

  switch (req.method) {
    case 'POST': {
      try {
        await getOneConversation(userId as string, conversationId as string);

        const parsedBody = completionBodySchema.parse(req.body);

        const completion = await getCompletions({
          model: parsedBody.model,
          messages: parsedBody.messages,
        });

        const result = await prisma.message.create({
          data: {
            content: completion.choices[0].message.content || '',
            role: 'assistant',
            conversationId: conversationId as string,
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
