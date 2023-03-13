import { Icon } from '@iconify/react';
import { ActionIcon, Checkbox, Stack, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export type TPromptForm = {
  prompt: string;
  asSystemMessage: boolean;
};

const PromptForm = ({
  isBusy,
  onSubmit,
  allowSystemMessage = false,
}: {
  isBusy: boolean;
  onSubmit: (data: TPromptForm) => unknown;
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
      });
    }
  }, [formState.isSubmitSuccessful, reset]);

  return (
    <form className="w-full md:w-1/2" onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <TextInput
          rightSection={
            <ActionIcon
              color="blue"
              loading={isBusy}
              size="md"
              type="submit"
              variant="light"
            >
              <Icon
                height={16}
                icon="material-symbols:send-outline"
                width={16}
              />
            </ActionIcon>
          }
          size="lg"
          {...register('prompt', {
            validate: {
              notEmpty: (value: string) => value.trim().length > 0,
              notBusy: () => !isBusy,
            },
          })}
        />
        {allowSystemMessage && (
          <Checkbox
            label="Set as system instruction"
            {...register('asSystemMessage')}
          />
        )}
      </Stack>
    </form>
  );
};

export { PromptForm };
