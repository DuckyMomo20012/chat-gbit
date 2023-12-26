import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { bcrypt } from 'hash-wasm';
import { z } from 'zod';
import {
  HASH_ROUNDS,
  createUser,
  getAllUsers,
  userBodySchema,
} from '@/app/api/users/service';

// NOTE: This should be deprecated, due to security concerns.
const GET = async () => {
  const result = await getAllUsers();

  return Response.json(result, {
    status: 200,
  });
};

const POST = async (req: Request) => {
  const body = await req.json();

  try {
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
