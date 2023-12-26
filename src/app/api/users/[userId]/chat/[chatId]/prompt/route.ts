import { z } from 'zod';
import {
  getOneChat,
  promptBodySchema,
} from '@/app/api/users/[userId]/chat/service';
import { auth } from '@/lib/auth';
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
    const parsedBody = promptBodySchema.parse(body);

    const allMessages = await getOneChat(userId, chatId);

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

      return Response.json(result, {
        status: 200,
      });
    }
    // NOTE: Add new prompt message if there is a completion added before this
    // message
    const result = await prisma.message.create({
      data: {
        content: parsedBody.content,
        role: parsedBody.role,
        chatId,
        isHidden: parsedBody.isHidden,
        isTrained: parsedBody.isTrained,
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
