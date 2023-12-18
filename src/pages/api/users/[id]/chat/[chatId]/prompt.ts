import { type NextApiRequest, type NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getOneChat } from '@/pages/api/users/[id]/chat/[chatId]';

export const promptBodySchema = z.object({
  content: z.string().max(191),
  role: z.enum(['system', 'user', 'assistant']),
  isHidden: z.boolean().optional(),
  isTrained: z.boolean().optional(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: userId, chatId } = req.query;

  if (!userId || !chatId) {
    return res.status(400).json({ error: 'Bad request' });
  }

  switch (req.method) {
    case 'POST': {
      try {
        const parsedBody = promptBodySchema.parse(req.body);

        const allMessages = await getOneChat(
          userId as string,
          chatId as string,
        );

        const lastMessage = allMessages?.messages.at(-1);

        // NOTE: Mutate last prompt message if there is no completion added
        if (lastMessage?.role === 'user' && parsedBody.role === 'user') {
          const result = await prisma.message.update({
            where: { id: lastMessage.id },
            data: {
              content: parsedBody.content,
              role: parsedBody.role,
              isHidden: parsedBody.isHidden,
              isTrained: parsedBody.isTrained,
            },
          });

          return res.status(200).json(result);
        }
        // NOTE: Add new prompt message if there is a completion added before this
        // message
        const result = await prisma.message.create({
          data: {
            content: parsedBody.content,
            role: parsedBody.role,
            chatId: chatId as string,
            isHidden: parsedBody.isHidden,
            isTrained: parsedBody.isTrained,
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
