import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { chatBodySchema } from '@/app/api/users/[userId]/chat/route';
import prisma from '@/lib/prisma';

export const getOneChat = async (userId: string, chatId: string) => {
  return prisma.chat.findUniqueOrThrow({
    where: { id: chatId, userId },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
};

export const updateChat = async (
  userId: string,
  chatId: string,
  data: Prisma.ChatUncheckedUpdateManyWithoutUserInput,
) => {
  return prisma.chat.update({
    where: { id: chatId, userId },
    data,
  });
};

export const deleteChat = async (userId: string, chatId: string) => {
  return prisma.chat.delete({
    where: { id: chatId, userId },
  });
};

export type GetOneChat = Prisma.PromiseReturnType<typeof getOneChat>;
export type UpdateChat = Prisma.PromiseReturnType<typeof updateChat>;
export type DeleteChat = Prisma.PromiseReturnType<typeof deleteChat>;

const GET = async (
  req: Request,
  context: {
    params: {
      userId: string;
      chatId: string;
    };
  },
) => {
  const { userId, chatId } = context.params;

  try {
    const result = await getOneChat(userId, chatId);

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
      { error: 'Not found' },
      {
        status: 404,
      },
    );
  }
};

const PATCH = async (
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
    const parsedBody = chatBodySchema.parse(body);

    const result = await updateChat(
      userId as string,
      chatId as string,
      parsedBody,
    );

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

const DELETE = async (
  req: Request,
  context: {
    params: {
      userId: string;
      chatId: string;
    };
  },
) => {
  const { userId, chatId } = context.params;

  try {
    const result = await deleteChat(userId, chatId);

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

export { GET, PATCH, DELETE };
