import { z } from 'zod';
import { getOneChat } from '@/app/api/users/[userId]/chat/service';
import { auth } from '@/lib/auth';
import { chatCompletionBodySchema, getCompletions } from '@/lib/openai';
import prisma from '@/lib/prisma';

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

  const session = await auth();

  if (!session || session.user.id !== userId) {
    return Response.json(
      { error: 'Unauthorized' },
      {
        status: 401,
      },
    );
  }

  const body = await req.json();

  try {
    const parsedBody = chatCompletionBodySchema
      .pick({
        model: true,
      })
      .parse(body);

    const allMessages = await getOneChat(userId, chatId);

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

      return Response.json(result, {
        status: 200,
      });
    }
    // NOTE: Add new completion message
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
