import { type NextApiRequest, type NextApiResponse } from 'next';
import { z } from 'zod';
import { getCompletions } from '@/lib/openai';
import prisma from '@/lib/prisma';
import { messageBodySchema } from '@/pages/api/messages/index';

export const completionBodySchema = messageBodySchema
  .pick({
    role: true,
    content: true,
  })
  .extend({
    model: z.string(),
  });

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  switch (req.method) {
    case 'POST': {
      try {
        const parsedBody = completionBodySchema.parse(req.body);

        const allMessages = await prisma.conversation.findUniqueOrThrow({
          where: { id: id as string },
          include: {
            messages: true,
          },
        });

        const lastMessage = allMessages?.messages.at(-1);

        // NOTE: Mutate last prompt message if there is no completion added
        if (lastMessage?.role === 'user' && parsedBody.role === 'user') {
          await prisma.message.update({
            where: { id: lastMessage.id },
            data: {
              content: parsedBody.content,
              role: parsedBody.role,
            },
          });
        } else {
          // NOTE: Add new prompt message if there is a completion added before this
          // message
          await prisma.message.create({
            data: {
              content: parsedBody.content,
              role: parsedBody.role,
              conversationId: id as string,
            },
          });
        }

        const updatedMessages = await prisma.conversation.findUniqueOrThrow({
          where: { id: id as string },
          include: {
            messages: true,
          },
        });

        try {
          const completion = await getCompletions({
            model: parsedBody.model,
            messages:
              updatedMessages?.messages.map((m) => ({
                role: m.role,
                content: m.content,
              })) || [],
          });
          await prisma.message.create({
            data: {
              content: completion.choices[0].message.content || '',
              role: 'assistant',
              conversationId: id as string,
            },
          });

          return res.status(200).json(completion);
        } catch (err) {
          return res.status(500).json({ error: 'Internal server error' });
        }
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
