import { clearChat } from 'src/app/api/users/[userId]/chat/service';

const POST = async (
  req: Request,
  context: {
    params: {
      userId: string;
      chatId: string;
    };
  },
) => {
  const { userId, chatId } = context.params;

  try {
    const result = await clearChat(userId, chatId);

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

export { POST };
