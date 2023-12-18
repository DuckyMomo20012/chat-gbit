import { Button, Group, Stack, TextInput } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { type GetOneConversation } from '@/pages/api/users/[id]/conversations/[conversationId]';

export const conversationSchema = z.object({
  title: z.string(),
});

export type TConversationForm = z.infer<typeof conversationSchema>;

const ConvoForm = ({ conversationId }: { conversationId: string }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const queryClient = useQueryClient();

  const { data: conversation } = useQuery({
    queryKey: ['conversations', userId, conversationId],
    queryFn: async (): Promise<GetOneConversation> => {
      const { data } = await axios.get(
        `/api/users/${userId}/conversations/${conversationId}`,
      );

      return data;
    },
  });

  const { mutate: updateTitle } = useMutation({
    mutationKey: ['conversations', 'updateTitle', userId, conversationId],
    mutationFn: async (data: TConversationForm) => {
      const { data: convo } = await axios.patch(
        `/api/users/${userId}/conversations/${conversationId}`,
        {
          title: data.title,
        },
      );

      return convo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['conversations'],
      });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TConversationForm>({
    defaultValues: {
      title: '',
    },
  });

  useEffect(() => {
    if (conversation) {
      reset({ title: conversation.title });
    }
  }, [conversation, reset]);

  const onSubmit = (data: TConversationForm) => {
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
