'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Checkbox,
  Group,
  JsonInput,
  Stack,
} from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { promptBodySchema } from '@/app/api/users/[userId]/chat/[chatId]/prompt/route';
import { type GetOneChat } from '@/app/api/users/[userId]/chat/[chatId]/route';

export const uploadSchema = z.object({
  hideMessages: z.boolean(),
  messages: z.string().transform((val, ctx) => {
    try {
      return z
        .array(
          promptBodySchema.pick({
            role: true,
            content: true,
          }),
        )
        .parse(JSON.parse(val));
    } catch (err) {
      if (err instanceof SyntaxError) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid JSON',
        });
      } else if (err instanceof z.ZodError) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: fromZodError(err).message,
        });
      }

      return [];
    }
  }),
});

export type TUploadForm = z.input<typeof uploadSchema>;
export type TUploadData = z.output<typeof uploadSchema>;

const UploadForm = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.slug?.at(0);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const getChatId = useCallback(async () => {
    if (!id) {
      const { data } = await axios.post(`/api/users/${userId}/chat`, {
        title: 'Untitled',
      });

      await router.push(`/${data.id}`);

      return data.id;
    }

    return id;
  }, [id, userId, router]);

  const queryClient = useQueryClient();

  const { data: trainedMessages } = useQuery({
    queryKey: ['users', userId, 'chat', params?.slug, { type: 'upload' }],
    queryFn: async () => {
      try {
        // NOTE: Handle root path
        if (!id) return [];

        const { data } = await axios.get(`/api/users/${userId}/chat/${id}`);

        return (data.messages as GetOneChat['messages'])
          .filter((m) => m.isTrained)
          .map((m) => ({
            role: m.role,
            content: m.content,
          }));
      } catch (err) {
        if (err instanceof AxiosError) {
          throw err;
        }
      }

      return [];
    },
    enabled: !!params?.slug,
  });

  const { isPending: isSubmittingPrompt, mutate: uploadTrainMessages } =
    useMutation({
      mutationKey: ['user', userId, 'chat', params?.slug, { type: 'upload' }],
      mutationFn: async ({
        chatId,
        messages,
        hideMessages,
      }: {
        chatId: string;
      } & TUploadData) => {
        // NOTE: Clear all the prompt before uploading
        await axios.post(`/api/users/${userId}/chat/${chatId}/clear`);

        const result = await Promise.all(
          messages.map((m) => {
            return axios.post(`/api/users/${userId}/chat/${chatId}/prompt`, {
              role: m.role,
              content: m.content,
              isHidden: hideMessages,
              isTrained: true,
            });
          }),
        );

        return result;
      },
      onSuccess: () => {
        // NOTE: We have to invalidate the whole chat, because we may create new
        // chat if the chatId is not provided
        queryClient.invalidateQueries({
          queryKey: ['users', userId, 'chat'],
        });

        queryClient.invalidateQueries({
          queryKey: ['users', userId, 'chat', params?.slug, { type: 'upload' }],
        });
      },
    });

  const {
    control,
    register,
    setError,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TUploadForm>({
    mode: 'onChange',
    defaultValues: {
      messages: '',
      hideMessages: false,
    },
    resolver: zodResolver(uploadSchema),
  });

  useEffect(() => {
    if (!trainedMessages) return;

    const formattedConvo =
      trainedMessages?.length > 0
        ? JSON.stringify(trainedMessages, null, 2)
        : '';
    reset({
      messages: formattedConvo,
      hideMessages: false,
    } satisfies TUploadForm);
  }, [trainedMessages, reset]);

  const onSubmit = async (data: unknown) => {
    const formData = data as TUploadData;

    try {
      // NOTE: We purge the convo even if the data is an empty array
      if (formData.messages.length >= 0) {
        const chatId = await getChatId();

        uploadTrainMessages({
          chatId,
          messages: formData.messages,
          hideMessages: formData.hideMessages,
        });
      }
    } catch (error) {
      setError('messages', {
        type: 'custom',
        message: 'Invalid JSON',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Alert color="yellow" title="Warning">
          Update training chat will delete <b>all the chat history</b>.
        </Alert>

        <Controller
          control={control}
          name="messages"
          render={({ field }) => (
            <JsonInput
              autosize
              error={errors.messages?.message}
              label="Training chat"
              maxRows={10}
              minRows={10}
              placeholder={JSON.stringify(
                [
                  {
                    role: 'user',
                    content: 'Hello world!',
                  },
                  {
                    role: 'assistant',
                    content: 'Hi there!',
                  },
                ],
                null,
                '  ',
              )}
              {...field}
            />
          )}
        />
        <Checkbox
          label="Hide training messages"
          radius="sm"
          {...register('hideMessages')}
        />
        <Group justify="center">
          <Button
            disabled={!isDirty || isSubmittingPrompt}
            onClick={() => reset()}
            variant="outline"
          >
            Discard
          </Button>
          <Button disabled={!isDirty || isSubmittingPrompt} type="submit">
            Update
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export { UploadForm };
