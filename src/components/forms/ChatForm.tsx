'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group, Stack, TextInput } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  type GetOneChat,
  type UpdateChat,
} from '@/app/api/users/[userId]/chat/[chatId]/route';

export const chatSchema = z.object({
  title: z.string(),
});

export type TChatForm = z.infer<typeof chatSchema>;

const ChatForm = ({ chatId }: { chatId: string }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const queryClient = useQueryClient();

  const { data: chat } = useQuery({
    queryKey: ['users', userId, 'chat', chatId],
    queryFn: async (): Promise<GetOneChat> => {
      const { data } = await axios.get(`/api/users/${userId}/chat/${chatId}`);

      return data;
    },
  });

  const { mutate: updateTitle } = useMutation({
    mutationKey: ['users', userId, 'chat', chatId, { type: 'updateTitle' }],
    mutationFn: async (formData: TChatForm): Promise<UpdateChat> => {
      const { data } = await axios.patch(
        `/api/users/${userId}/chat/${chatId}`,
        {
          title: formData.title,
        },
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users', userId, 'chat'],
      });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TChatForm>({
    defaultValues: {
      title: '',
    },
    resolver: zodResolver(chatSchema),
  });

  useEffect(() => {
    if (chat) {
      reset({ title: chat.title });
    }
  }, [chat, reset]);

  const onSubmit = (formData: TChatForm) => {
    updateTitle(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <TextInput
          label="Title"
          {...register('title')}
          error={errors.title?.message}
        />

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

export { ChatForm };
