import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { bcrypt } from 'hash-wasm';
import { z } from 'zod';
import prisma from '@/lib/prisma';

export const userBodySchema = z.object({
  email: z.string().email(),
  name: z.string().nullish(),
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

const GET = async () => {
  const result = await getAllUsers();

  return Response.json(result, {
    status: 200,
  });
};

const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const parsedBody = userBodySchema.parse(body);

    const hashPassword = await bcrypt({
      password: parsedBody.password,
      salt: crypto.randomBytes(16),
      costFactor: HASH_ROUNDS,
    });

    const result = await createUser({
      ...parsedBody,
      password: hashPassword,
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

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return Response.json(
          { error: 'User already exists' },
          {
            status: 409,
          },
        );
      }
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
