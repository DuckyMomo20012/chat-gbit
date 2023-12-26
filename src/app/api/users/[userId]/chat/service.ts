import { Prisma } from '@prisma/client';
import { z } from 'zod';
import prisma from '@/lib/prisma';

export const chatBodySchema = z.object({
  title: z.string().min(1).max(191),
});

export const promptBodySchema = z.object({
  content: z.string().max(191),
  role: z.enum(['system', 'user', 'assistant']),
  isHidden: z.boolean().optional(),
  isTrained: z.boolean().optional(),
});

export const getChat = async (userId: string) => {
  return prisma.chat.findMany({
    where: { userId },
  });
};

export const createChat = async (
  userId: string,
  data: Prisma.ChatUncheckedCreateWithoutUserInput,
) => {
  return prisma.chat.create({
    data: {
      ...data,
      user: {
        connect: { id: userId },
      },
    },
  });
};

export const getOneChat = async (userId: string, chatId: string) => {
  return prisma.chat.findUniqueOrThrow({
    where: { id: chatId, userId },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
};

export const updateChat = async (
  userId: string,
  chatId: string,
  data: Prisma.ChatUncheckedUpdateManyWithoutUserInput,
) => {
  return prisma.chat.update({
    where: { id: chatId, userId },
    data,
  });
};

export const deleteChat = async (userId: string, chatId: string) => {
  return prisma.chat.delete({
    where: { id: chatId, userId },
  });
};

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

export type GetChat = Prisma.PromiseReturnType<typeof getChat>;
export type CreateChat = Prisma.PromiseReturnType<typeof createChat>;

export type GetOneChat = Prisma.PromiseReturnType<typeof getOneChat>;
export type UpdateChat = Prisma.PromiseReturnType<typeof updateChat>;
export type DeleteChat = Prisma.PromiseReturnType<typeof deleteChat>;
