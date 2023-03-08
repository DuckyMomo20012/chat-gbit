import { Icon } from '@iconify/react';
import { ActionIcon, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export type TFormData = {
  prompt: string;
};

const PromptForm = ({
  isBusy,
  onSubmit,
}: {
  isBusy: boolean;
  onSubmit: (data: TFormData) => unknown;
}) => {
  const { register, reset, handleSubmit, setFocus, formState } =
    useForm<TFormData>();

  useEffect(() => {
    setFocus('prompt');
  }, [setFocus]);

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({
        prompt: '',
      });
    }
  }, [formState.isSubmitSuccessful, reset]);

  return (
    <form className="w-full md:w-1/2" onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        rightSection={
          <ActionIcon
            color="blue"
            loading={isBusy}
            size="md"
            type="submit"
            variant="light"
          >
            <Icon height={16} icon="material-symbols:send-outline" />
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
    </form>
  );
};

export { PromptForm };
