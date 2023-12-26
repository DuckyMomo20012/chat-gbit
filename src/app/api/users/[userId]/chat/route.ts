import { z } from 'zod';
import {
  chatBodySchema,
  createChat,
  getChat,
} from '@/app/api/users/[userId]/chat/service';

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
