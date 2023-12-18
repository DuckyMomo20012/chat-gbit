import { Prisma } from '@prisma/client';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { userBodySchema } from '@/pages/api/users/index';

export const getOneUser = async (id: string) => {
  return prisma.user.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
  return prisma.user.update({
    where: { id },
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

export const deleteUser = async (id: string) => {
  return prisma.user.delete({
    where: { id },
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

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Bad request' });
  }

  switch (req.method) {
    case 'GET': {
      try {
        const result = await getOneUser(id as string);

        return res.status(200).json(result);
      } catch (err) {
        return res.status(404).json({ error: 'Not found' });
      }
    }

    case 'PATCH': {
      try {
        const parsedBody = userBodySchema
          .omit({
            email: true,
            password: true,
          })
          .partial()
          .parse(req.body);

        const result = await updateUser(id as string, parsedBody);

        return res.status(200).json(result);
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({ error: 'Bad request' });
        }

        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    case 'DELETE': {
      try {
        const result = await deleteUser(id as string);

        return res.status(200).json(result);
      } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    default: {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  }
}

export default handler;
