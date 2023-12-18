import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group, PasswordInput, Space, Stack } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { type UpdateUser } from '@/pages/api/users/[id]';
import { changePasswordBodySchema } from '@/pages/api/users/[id]/change-password';

export const changePasswordSchema = changePasswordBodySchema
  .extend({
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type TChangePasswordForm = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm = ({ userId }: { userId?: string }) => {
  const queryClient = useQueryClient();

  const {
    setError,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TChangePasswordForm>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    resolver: zodResolver(changePasswordSchema),
  });

  const { mutate: updateUser } = useMutation({
    mutationKey: ['users', userId, 'update'],
    mutationFn: async (data: TChangePasswordForm): Promise<UpdateUser> => {
      const { data: user } = await axios.patch(
        `/api/users/${userId}/change-password`,
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
      );

      return user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users', userId],
      });

      // NOTE: We need to sign out the user after changing the password because
      // the session is no longer valid.
      signOut({
        redirect: false,
        callbackUrl: '/auth/sign-in',
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          setError('oldPassword', {
            message: 'Old password is incorrect',
          });
        }
      }
    },
  });

  const onSubmit = (data: TChangePasswordForm) => {
    updateUser(data);
  };

  return (
    <form className="h-full w-full" onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <PasswordInput
          error={errors.oldPassword?.message}
          label="Old password"
          {...register('oldPassword')}
        />
        <PasswordInput
          error={errors.newPassword?.message}
          label="New password"
          {...register('newPassword')}
        />
        <PasswordInput
          error={errors.confirmPassword?.message}
          label="Confirm password"
          {...register('confirmPassword')}
        />

        <Space h="md" />

        <Group justify="center">
          <Button disabled={!isDirty} onClick={() => reset()} variant="outline">
            Discard
          </Button>
          <Button disabled={!isDirty} type="submit">
            Update
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export { ChangePasswordForm };
