import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { bcrypt } from 'hash-wasm';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';

export const userBodySchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(8),
});

export const HASH_ROUNDS = 10;

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const createUser = async (data: Prisma.UserCreateInput) => {
  return prisma.user.create({
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

export type GetAllUsers = Prisma.PromiseReturnType<typeof getAllUsers>;
export type CreateUser = Prisma.PromiseReturnType<typeof createUser>;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      const result = await getAllUsers();

      return res.status(200).json(result);
    }

    case 'POST': {
      try {
        const parsedBody = userBodySchema.parse(req.body);

        const hashPassword = await bcrypt({
          password: parsedBody.password,
          salt: crypto.randomBytes(16),
          costFactor: HASH_ROUNDS,
        });

        const result = await createUser({
          ...parsedBody,
          password: hashPassword,
        });

        return res.status(200).json(result);
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({ error: 'Bad request' });
        }

        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            return res.status(409).json({ error: 'User already exists' });
          }
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
