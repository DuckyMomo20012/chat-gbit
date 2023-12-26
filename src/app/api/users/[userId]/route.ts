import { z } from 'zod';
import {
  deleteUser,
  getOneUser,
  updateUser,
  userBodySchema,
} from '@/app/api/users/service';
import { auth } from '@/lib/auth';

const GET = async (
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

  const session = await auth();

  if (!session || session.user.id !== userId) {
    return Response.json(
      { error: 'Unauthorized' },
      {
        status: 401,
      },
    );
  }

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
