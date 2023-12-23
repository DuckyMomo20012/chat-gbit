'use client';

import { Icon } from '@iconify/react';
import {
  ActionIcon,
  Checkbox,
  Group,
  Loader,
  Stack,
  Text,
} from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { type OpenAI } from 'openai';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
  TVoiceInputHandle,
  VoiceInput,
} from '@/components/elements/VoiceInput';
import { type TPromptForm } from '@/components/forms/PromptForm';
import { type RootState } from '@/store/store';

type TVoiceForm = {
  model: string;
  audio: Array<Blob>;
  asSystemMessage: boolean;
};

const RECORD_TIMEOUT = 30000;

const VoiceForm = ({
  isBusy,
  submitPrompt,
  allowSystemMessage = false,
}: {
  isBusy: boolean;
  submitPrompt: (formData: TPromptForm) => unknown;
  allowSystemMessage?: boolean;
}) => {
  const currModel = useSelector((state: RootState) => state.model);

  const voiceRef = useRef<TVoiceInputHandle>();
  const {
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = useForm<TVoiceForm>();

  register('model', {
    value: currModel.audio.name,
  });

  register('audio', {
    validate: (blob: Array<Blob>) => {
      return blob.length > 0;
    },
  });

  useEffect(() => {
    // NOTE: Reset the form after the form is submitted
    if (isSubmitSuccessful) {
      reset({
        model: currModel.audio.name,
        audio: [],
        asSystemMessage: false,
      } satisfies TVoiceForm);
      // NOTE: Manually clear the audio data from the voice input
      voiceRef.current?.clear();
    }
  }, [reset, isSubmitSuccessful, currModel.audio.name]);

  const { isPending, error, mutateAsync } = useMutation({
    mutationKey: ['voice'],
    mutationFn: async (
      formData: TVoiceForm,
    ): Promise<OpenAI.Audio.Transcription> => {
      const blob = new Blob(formData.audio, { type: 'audio/webm;codecs=opus' });

      const newForm = new FormData();
      newForm.append('model', formData.model);
      newForm.append('audio', blob);

      // TODO: Send voice data to server
      const { data } = await axios.post('/api/transcriptions', newForm);

      return data;
    },
  });

  const onSubmit = async (formData: TVoiceForm) => {
    const transcriptions = await mutateAsync(formData);

    submitPrompt({
      prompt: transcriptions.text,
      asSystemMessage: formData.asSystemMessage,
    });
  };

  return (
    <form className="w-full max-w-xl" onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        {isPending && (
          <Group className="justify-center" gap="xs">
            <Loader size="xs" />
            <Text>Transcribing</Text>
          </Group>
        )}
        {(error as AxiosError) && (
          <Group className="justify-center">
            <Text c="red">There was an error transcribing your voice.</Text>
          </Group>
        )}
        <Group className="items-center justify-center">
          <VoiceInput
            ref={(handle: TVoiceInputHandle) => {
              if (handle === null) return;

              voiceRef.current = handle;

              setValue('audio', handle.chunks);
            }}
            timeout={RECORD_TIMEOUT}
          />
          <ActionIcon
            color="pink"
            disabled={isBusy}
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

export { VoiceForm };
