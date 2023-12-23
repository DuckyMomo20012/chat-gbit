import prisma from '@/lib/prisma';

export const clearChat = async (userId: string, chatId: string) => {
  return prisma.chat.update({
    where: { id: chatId as string, userId: userId as string },
    data: {
      messages: {
        deleteMany: {},
      },
    },
  });
};

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
