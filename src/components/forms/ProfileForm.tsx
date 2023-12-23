import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group, Space, Stack, TextInput } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  type GetOneUser,
  type UpdateUser,
} from '@/app/api/users/[userId]/route';
import { userBodySchema } from '@/app/api/users/route';

export const profileSchema = userBodySchema.pick({ name: true });

export type TProfileForm = z.infer<typeof profileSchema>;

const ProfileForm = ({ userId }: { userId?: string }) => {
  const queryClient = useQueryClient();

  const { data: userInfo } = useQuery({
    queryKey: ['users', userId],
    queryFn: async (): Promise<GetOneUser> => {
      const { data } = await axios.get(`/api/users/${userId}`);

      return data;
    },
    enabled: !!userId,
  });

  const { mutate: updateUser } = useMutation({
    mutationKey: ['users', userId, 'update'],
    mutationFn: async (formData: TProfileForm): Promise<UpdateUser> => {
      const { data } = await axios.patch(`/api/users/${userId}`, {
        name: formData.name,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users', userId],
      });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TProfileForm>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (userInfo) {
      reset({
        name: userInfo.name,
      });
    }
  }, [userInfo, reset]);

  const onSubmit = (formData: TProfileForm) => {
    updateUser(formData);
  };

  return (
    <form className="h-full w-full" onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <TextInput
          error={errors.name?.message}
          label="Name"
          {...register('name')}
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

export { ProfileForm };
