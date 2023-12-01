import {
  Alert,
  Button,
  Checkbox,
  Group,
  JsonInput,
  Stack,
} from '@mantine/core';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { addMessage, selectAllConvo } from '@/store/slice/convoSlice';
import { RootState, persistor } from '@/store/store';

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
  const dispatch = useDispatch();
  const hiddenMessage = useSelector((state: RootState) =>
    selectAllConvo(state)
      .filter((item) => item.hidden || item.trained)
      .map((item) => ({
        role: item.role,
        content: item.content,
      })),
  );

  const defaultValues = useMemo(() => {
    return {
      convo:
        hiddenMessage.length > 0 ? JSON.stringify(hiddenMessage, null, 2) : '',
      hideMessages: false,
    } satisfies TUploadForm;
  }, [hiddenMessage]);

  const {
    setValue,
    register,
    watch,
    setError,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isDirty },
  } = useForm<TUploadForm>({
    mode: 'onChange',
    defaultValues,
  });

  const watchConvo = watch('convo');

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(defaultValues);
    }
  }, [isSubmitSuccessful, defaultValues, reset]);

  const onSubmit = (data: TUploadForm) => {
    try {
      if (data.convo === '') {
        persistor.purge();
        return;
      }

      const parsed = JSON.parse(data.convo);
      const convo = convoSchema.parse(parsed);

      // NOTE: We purge the convo even if the data is an empty array
      if (convo.length >= 0) {
        persistor.purge();

        convo.forEach((message) => {
          dispatch(
            addMessage({
              ...message,
              isTyping: false,
              hidden: data.hideMessages,
              trained: true,
            }),
          );
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
          disabled={watchConvo === ''}
          label="Hide training messages"
          radius="sm"
          {...register('hideMessages')}
        />
        <Group position="center">
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

export { UploadForm };
