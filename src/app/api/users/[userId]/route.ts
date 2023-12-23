import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { userBodySchema } from '@/app/api/users/route';
import prisma from '@/lib/prisma';

export const getOneUser = async (userId: string) => {
  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateUser = async (
  userId: string,
  data: Prisma.UserUpdateInput,
) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteUser = async (userId: string) => {
  return prisma.user.delete({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export type GetOneUser = Prisma.PromiseReturnType<typeof getOneUser>;
export type UpdateUser = Prisma.PromiseReturnType<typeof updateUser>;
export type DeleteUser = Prisma.PromiseReturnType<typeof deleteUser>;

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
    const result = await getOneUser(userId);

    return Response.json(result, {
      status: 200,
    });
  } catch (err) {
    return Response.json(
      { error: 'Not found' },
      {
        status: 400,
      },
    );
  }
};

const PATCH = async (
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
    const parsedBody = userBodySchema
      .omit({
        email: true,
        password: true,
      })
      .partial()
      .parse(body);

    const result = await updateUser(userId, parsedBody);

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
    };
  },
) => {
  const { userId } = context.params;

  try {
    const result = await deleteUser(userId);

    return Response.json(result, {
      status: 200,
    });
  } catch (err) {
    return Response.json(
      { error: 'Internal server error' },
      {
        status: 500,
      },
    );
  }
};

export { GET, PATCH, DELETE };
