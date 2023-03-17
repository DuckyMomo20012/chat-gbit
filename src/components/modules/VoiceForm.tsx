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
import { CreateTranscriptionResponse } from 'openai';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  TVoiceInputHandle,
  VoiceInput,
} from '@/components/elements/VoiceInput';
import type { TPromptForm } from '@/pages/index';

type TVoiceForm = {
  model: string;
  audio: Array<Blob>;
  asSystemMessage: boolean;
};

const RECORD_TIMEOUT = 30000;

const VOICE_MODEL = 'whisper-1';

const VoiceForm = ({
  isBusy,
  submitPrompt,
  allowSystemMessage = false,
}: {
  isBusy: boolean;
  submitPrompt: (data: TPromptForm) => unknown;
  allowSystemMessage?: boolean;
}) => {
  const voiceRef = useRef<TVoiceInputHandle>();
  const {
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = useForm<TVoiceForm>();

  register('model', {
    value: VOICE_MODEL,
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
        model: VOICE_MODEL,
        audio: [],
        asSystemMessage: false,
      } satisfies TVoiceForm);
      // NOTE: Manually clear the audio data from the voice input
      voiceRef.current?.clear();
    }
  }, [reset, isSubmitSuccessful]);

  const { isLoading, error, mutateAsync } = useMutation({
    mutationFn: async (
      formData: TVoiceForm,
    ): Promise<CreateTranscriptionResponse> => {
      const blob = new Blob(formData.audio, { type: 'audio/webm;codecs=opus' });

      const newForm = new FormData();
      newForm.append('model', formData.model);
      newForm.append('audio', blob);

      // TODO: Send voice data to server
      const { data } = await axios.post('/api/transcriptions', newForm);

      return data;
    },
  });

  const onSubmit = async (data: TVoiceForm) => {
    const transcriptions = await mutateAsync(data);

    submitPrompt({
      prompt: transcriptions.text,
      asSystemMessage: data.asSystemMessage,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack align="center">
        {isLoading && (
          <Group spacing="xs">
            <Loader size="xs" />
            <Text>Transcribing</Text>
          </Group>
        )}
        {(error as AxiosError) && (
          <Text color="red">There was an error transcribing your voice.</Text>
        )}
        <Group>
          <VoiceInput
            ref={(handle: TVoiceInputHandle) => {
              if (handle === null) return;

              voiceRef.current = handle;

              setValue('audio', handle.chunks);
            }}
            timeout={RECORD_TIMEOUT}
          />
          <ActionIcon
            className="self-start"
            color="pink"
            disabled={isBusy}
            size="lg"
            type="submit"
            variant="light"
          >
            <Icon height={24} icon="material-symbols:send-outline" width={24} />
          </ActionIcon>
        </Group>
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

export { VoiceForm };
