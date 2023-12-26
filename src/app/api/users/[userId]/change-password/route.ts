import crypto from 'crypto';
import { bcrypt, bcryptVerify } from 'hash-wasm';
import { z } from 'zod';
import {
  HASH_ROUNDS,
  changePasswordBodySchema,
  updateUser,
} from '@/app/api/users/service';
import { auth } from '@/lib/auth';

const PATCH = async (
  req: Request,
  context: {
    params: {
      userId: string;
    };
  },
) => {
  const { userId } = context.params;

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
    const parsedBody = changePasswordBodySchema.parse(body);

    const user = await prisma?.user.findUniqueOrThrow({
      where: { id: userId as string },
      select: { password: true },
    });

    if (!user) {
      return Response.json(
        { error: 'Not found' },
        {
          status: 404,
        },
      );
    }

    const oldPasswordMatches = await bcryptVerify({
      password: parsedBody.oldPassword,
      hash: user.password,
    });

    if (!oldPasswordMatches) {
      return Response.json(
        { error: 'Bad request' },
        {
          status: 400,
        },
      );
    }

    const newHashedPassword = await bcrypt({
      password: parsedBody.newPassword,
      salt: crypto.randomBytes(16),
      costFactor: HASH_ROUNDS,
    });

    const result = await updateUser(userId as string, {
      password: newHashedPassword,
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

export { PATCH };
