import { type NextApiRequest, type NextApiResponse } from 'next';
import { z } from 'zod';
import { getCompletions } from '@/lib/openai';
import prisma from '@/lib/prisma';
import { getOneChat } from '@/pages/api/users/[id]/chat/[chatId]';
import { completionBodySchema } from '@/pages/api/users/[id]/chat/[chatId]/completions';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: userId, chatId } = req.query;

  if (!userId || !chatId) {
    return res.status(400).json({ error: 'Bad request' });
  }

  switch (req.method) {
    case 'POST': {
      try {
        const parsedBody = completionBodySchema
          .pick({
            model: true,
          })
          .parse(req.body);

        const allMessages = await getOneChat(
          userId as string,
          chatId as string,
        );

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
            chatId: chatId as string,
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
