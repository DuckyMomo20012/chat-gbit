import crypto from 'crypto';
import { bcrypt, bcryptVerify } from 'hash-wasm';
import { z } from 'zod';
import { updateUser } from '@/app/api/users/[userId]/route';
import { HASH_ROUNDS } from '@/app/api/users/route';

export const changePasswordBodySchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

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
