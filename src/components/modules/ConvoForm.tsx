import { Button, Group, Stack, TextInput } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const conversationSchema = z.object({
  title: z.string(),
});

export type TConversationForm = z.infer<typeof conversationSchema>;

const ConvoForm = ({ conversationId }: { conversationId: string }) => {
  const queryClient = useQueryClient();

  const { data: conversation } = useQuery({
    queryKey: ['conversations', conversationId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/conversations/${conversationId}`);

      return data;
    },
  });

  const { mutate: updateTitle } = useMutation({
    mutationKey: ['conversations', 'updateTitle', conversationId],
    mutationFn: async (data: TConversationForm) => {
      const { data: convo } = await axios.patch(
        `/api/conversations/${conversationId}`,
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