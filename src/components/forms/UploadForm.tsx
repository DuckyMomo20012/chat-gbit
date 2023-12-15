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
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

type TUploadForm = {
  convo: string;
  hideMessages: boolean;
};

const convoSchema = z.array(
  z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string(),
  }),
);

const UploadForm = () => {
  const router = useRouter();

  const { slug } = router.query;
  const id = slug?.at(0);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const getConvoId = useCallback(async () => {
    if (!id) {
      const { data: convo } = await axios.post(
        `/api/users/${userId}/conversations`,
        {
          title: 'Untitled',
        },
      );

      await router.push(`/${convo.id}`);

      return convo.id;
    }

    return id;
  }, [id, userId, router]);

  const queryClient = useQueryClient();

  const { data: trainedMessages } = useQuery({
    queryKey: ['conversations', 'upload', userId, router.query.slug],
    queryFn: async () => {
      try {
        // NOTE: Handle root path
        if (!id) return [];

        const { data } = await axios.get(
          `/api/users/${userId}/conversations/${id}`,
        );

        return (
          data.messages as {
            role: 'user' | 'assistant' | 'system';
            content: string;
            isHidden: boolean;
            isTrained: boolean;
          }[]
        )
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
  });

  const { isPending: isSubmittingPrompt, mutate: uploadTrainMessages } =
    useMutation({
      mutationFn: async ({
        conversationId,
        messages,
        isHidden,
        isTrained,
      }: {
        conversationId: string;
        messages: {
          role: 'user' | 'system' | 'assistant';
          content: string;
        }[];
        isHidden?: boolean;
        isTrained?: boolean;
      }) => {
        // NOTE: Clear all the prompt before uploading
        await axios.post(
          `/api/users/${userId}/conversations/${conversationId}/clear`,
        );

        const result = await Promise.all(
          messages.map((m) => {
            return axios.post(
              `/api/users/${userId}/conversations/${conversationId}/prompt`,
              {
                role: m.role,
                content: m.content,
                isHidden,
                isTrained,
              },
            );
          }),
        );

        return result;
      },
      onSuccess: () => {
        // NOTE: Invalidate the query, because the prompt still created even if error
        queryClient.invalidateQueries({
          queryKey: ['conversations', router.query.slug],
        });

        queryClient.invalidateQueries({
          queryKey: ['conversations', 'upload', router.query.slug],
        });
      },
    });

  const {
    setValue,
    register,
    setError,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TUploadForm>({
    mode: 'onChange',
    defaultValues: {
      convo: '',
      hideMessages: false,
    },
  });

  useEffect(() => {
    if (!trainedMessages) return;

    const formattedConvo =
      trainedMessages?.length > 0
        ? JSON.stringify(trainedMessages, null, 2)
        : '';
    reset({
      convo: formattedConvo,
      hideMessages: false,
    } satisfies TUploadForm);
  }, [trainedMessages, reset]);

  const onSubmit = async (data: TUploadForm) => {
    try {
      if (data.convo === '') {
        return;
      }

      const parsed = JSON.parse(data.convo);
      const convo = convoSchema.parse(parsed);

      // NOTE: We purge the convo even if the data is an empty array
      if (convo.length >= 0) {
        const conversationId = await getConvoId();

        uploadTrainMessages({
          conversationId,
          messages: convo,
          isHidden: data.hideMessages,
          isTrained: true,
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);

        setError('convo', {
          type: 'custom',
          message: validationError.message,
        });
        return;
      }

      setError('convo', {
        type: 'custom',
        message: 'Invalid JSON',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Alert color="yellow" title="Warning">
          Update training conversation will delete{' '}
          <b>all the conversation history</b>.
        </Alert>

        <JsonInput
          autosize
          label="Training conversation"
          maxRows={10}
          minRows={10}
          placeholder={JSON.stringify(
            JSON.parse(
              '[{"role": "user", "content": "Hello world!"},{"role": "assistant", "content": "Hi there!"}]',
            ),
            null,
            '  ',
          )}
          {...register('convo', {
            validate: (value) => {
              try {
                if (value === '') {
                  return true;
                }

                convoSchema.parse(JSON.parse(value));
                return true;
              } catch (error) {
                if (error instanceof z.ZodError) {
                  const validationError = fromZodError(error);

                  return false || validationError.message;
                }
                return false || 'Invalid JSON';
              }
            },
          })}
          error={errors.convo?.message}
          onChange={(value) => {
            setValue('convo', value, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
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
