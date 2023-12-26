import { Prisma } from '@prisma/client';
import { z } from 'zod';
import prisma from '@/lib/prisma';

export const userBodySchema = z.object({
  email: z.string().email(),
  name: z.string().nullish(),
  password: z.string().min(8),
});

export const changePasswordBodySchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
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

export const getOneUser = async (userId: string) => {
  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateUser = async (
  userId: string,
  data: Prisma.UserUpdateInput,
) => {
  return prisma.user.update({
    where: { id: userId },
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

export const deleteUser = async (userId: string) => {
  return prisma.user.delete({
    where: { id: userId },
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

export type GetOneUser = Prisma.PromiseReturnType<typeof getOneUser>;
export type UpdateUser = Prisma.PromiseReturnType<typeof updateUser>;
export type DeleteUser = Prisma.PromiseReturnType<typeof deleteUser>;
