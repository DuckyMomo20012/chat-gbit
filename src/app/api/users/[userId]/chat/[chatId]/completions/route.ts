import { z } from 'zod';
import { getOneChat } from '@/app/api/users/[userId]/chat/[chatId]/route';
import { getCompletions } from '@/lib/openai';
import prisma from '@/lib/prisma';

export const completionBodySchema = z.object({
  model: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
    }),
  ),
});

const POST = async (
  req: Request,
  context: {
    params: {
      userId: string;
      chatId: string;
    };
  },
) => {
  const { userId, chatId } = context.params;

  const body = await req.json();

  try {
    await getOneChat(userId, chatId);

    const parsedBody = completionBodySchema.parse(body);

    const completion = await getCompletions({
      model: parsedBody.model,
      messages: parsedBody.messages,
    });

    const result = await prisma.message.create({
      data: {
        content: completion.choices[0].message.content || '',
        role: 'assistant',
        chatId,
      },
    });

    return Response.json(result, {
      status: 200,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json(
        { error: 'Bad request' },
        {
          status: 400,
        },
      );
    }
    return Response.json(
      { error: 'Internal server error' },
      {
        status: 500,
      },
    );
  }
};

export { POST };
