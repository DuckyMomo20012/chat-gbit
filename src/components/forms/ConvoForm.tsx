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
} from '@/pages/api/users/[id]/chat/[chatId]';

export const chatSchema = z.object({
  title: z.string(),
});

export type TChatForm = z.infer<typeof chatSchema>;

const ConvoForm = ({ chatId }: { chatId: string }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const queryClient = useQueryClient();

  const { data: chat } = useQuery({
    queryKey: ['chat', userId, chatId],
    queryFn: async (): Promise<GetOneChat> => {
      const { data } = await axios.get(`/api/users/${userId}/chat/${chatId}`);

      return data;
    },
  });

  const { mutate: updateTitle } = useMutation({
    mutationKey: ['chat', 'updateTitle', userId, chatId],
    mutationFn: async (data: TChatForm): Promise<UpdateChat> => {
      const { data: convo } = await axios.patch(
        `/api/users/${userId}/chat/${chatId}`,
        {
          title: data.title,
        },
      );

      return convo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chat'],
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
  });

  useEffect(() => {
    if (chat) {
      reset({ title: chat.title });
    }
  }, [chat, reset]);

  const onSubmit = (data: TChatForm) => {
    updateTitle(data);
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

export { ConvoForm };
