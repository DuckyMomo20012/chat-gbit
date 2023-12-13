import { Icon } from '@iconify/react';
import { ActionIcon, Checkbox, Group, Stack, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { TPromptForm } from '@/pages/[[...slug]]';

const PromptForm = ({
  isBusy,
  submitPrompt,
  allowSystemMessage = false,
}: {
  isBusy: boolean;
  submitPrompt: (data: TPromptForm) => unknown;
  allowSystemMessage?: boolean;
}) => {
  const { register, reset, handleSubmit, setFocus, formState } =
    useForm<TPromptForm>();

  useEffect(() => {
    setFocus('prompt');
  }, [setFocus]);

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({
        prompt: '',
        asSystemMessage: false,
      } satisfies TPromptForm);
    }
  }, [formState.isSubmitSuccessful, reset]);

  const onSubmit = (data: TPromptForm) => {
    submitPrompt(data);
  };

  return (
    <form className="w-full max-w-xl" onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Group className="justify-center">
          <TextInput
            className="flex-1"
            {...register('prompt', {
              validate: {
                notEmpty: (value: string) => value.trim().length > 0,
                notBusy: () => !isBusy,
              },
            })}
          />
          <ActionIcon
            color="blue"
            loading={isBusy}
            size="lg"
            type="submit"
            variant="light"
          >
            <Icon height={18} icon="material-symbols:send-outline" width={18} />
          </ActionIcon>
        </Group>
        {allowSystemMessage && (
          <Checkbox
            label="Set as system instruction"
            {...register('asSystemMessage')}
            radius="sm"
          />
        )}
      </Stack>
    </form>
  );
};

export { PromptForm };
