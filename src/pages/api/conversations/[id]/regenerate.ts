import { type NextApiRequest, type NextApiResponse } from 'next';
import { z } from 'zod';
import { getCompletions } from '@/lib/openai';
import prisma from '@/lib/prisma';
import { completionBodySchema } from '@/pages/api/conversations/[id]/completions';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  switch (req.method) {
    case 'POST': {
      try {
        const parsedBody = completionBodySchema
          .pick({
            model: true,
          })
          .parse(req.body);

        const allMessages = await prisma.conversation.findUnique({
          where: { id: id as string },
          include: {
            messages: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        });

        const completion = await getCompletions({
          model: parsedBody.model,
          messages:
            allMessages?.messages.map((m) => ({
              role: m.role,
              content: m.content,
            })) || [],
        });

        const lastMessage = allMessages?.messages.at(-1);

        // NOTE: Mutate last completion message
        if (lastMessage?.role === 'assistant') {
          const result = await prisma.message.update({
            where: { id: lastMessage.id },
            data: {
              content: completion.choices[0].message.content || '',
              role: 'assistant',
            },
          });

          return res.status(200).json(result);
        }
        // NOTE: Add new completion message
        const result = await prisma.message.create({
          data: {
            content: completion.choices[0].message.content || '',
            role: 'assistant',
            conversationId: id as string,
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
