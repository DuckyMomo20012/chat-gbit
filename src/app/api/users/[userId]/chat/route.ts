import { Prisma } from '@prisma/client';
import { z } from 'zod';
import prisma from '@/lib/prisma';

export const chatBodySchema = z.object({
  title: z.string().min(1).max(191),
});

export const getChat = async (userId: string) => {
  return prisma.chat.findMany({
    where: { userId },
  });
};

export const createChat = async (
  userId: string,
  data: Prisma.ChatUncheckedCreateWithoutUserInput,
) => {
  return prisma.chat.create({
    data: {
      ...data,
      user: {
        connect: { id: userId },
      },
    },
  });
};

export type GetChat = Prisma.PromiseReturnType<typeof getChat>;
export type CreateChat = Prisma.PromiseReturnType<typeof createChat>;

const GET = async (
  req: Request,
  context: {
    params: {
      userId: string;
    };
  },
) => {
  const { userId } = context.params;

  try {
    const result = await getChat(userId);

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

const POST = async (
  req: Request,
  context: {
    params: {
      userId: string;
    };
  },
) => {
  const { userId } = context.params;

  const body = await req.json();

  try {
    const parsedBody = chatBodySchema.parse(body);

    const result = await createChat(userId as string, parsedBody);

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

export { GET, POST };
