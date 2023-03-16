import { Icon } from '@iconify/react';
import { ActionIcon, Group, Loader, Stack, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { CreateTranscriptionResponse } from 'openai';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  TVoiceInputHandle,
  VoiceInput,
} from '@/components/elements/VoiceInput';
import type { TPromptForm } from '@/components/modules/PromptForm';

type TVoiceForm = {
  model: string;
  audio: Array<Blob>;
};

const RECORD_TIMEOUT = 30000;

const VOICE_MODEL = 'whisper-1';

const VoiceForm = ({
  onSubmit,
}: {
  onSubmit: (data: TPromptForm) => unknown;
}) => {
  const voiceRef = useRef<TVoiceInputHandle>();
  const isSubmitted = useRef(false);
  const {
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = useForm<TVoiceForm>();
  const [form, setForm] = useState<FormData>();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        model: VOICE_MODEL,
        audio: [],
      });
      // NOTE: Manually clear the audio data from the voice input
      voiceRef.current?.clear();
    }
  }, [reset, isSubmitSuccessful]);

  register('model', {
    value: VOICE_MODEL,
  });

  register('audio', {
    validate: (blob: Array<Blob>) => {
      return blob.length > 0;
    },
  });

  const {
    data: transcriptions,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['voice'],
    queryFn: async (): Promise<CreateTranscriptionResponse> => {
      // TODO: Send voice data to server
      const { data } = await axios.post('/api/transcriptions', form);

      return data;
    },
    enabled: isSubmitSuccessful,
  });

  useEffect(() => {
    if (transcriptions && isSubmitted.current) {
      onSubmit({
        prompt: transcriptions.text,
        asSystemMessage: false,
      });

      isSubmitted.current = false;
    }
  }, [transcriptions, onSubmit]);

  const onVoiceFormSubmit = (data: TVoiceForm) => {
    const blob = new Blob(data.audio, { type: 'audio/webm;codecs=opus' });

    const newForm = new FormData();
    newForm.append('model', data.model);
    newForm.append('audio', blob);

    setForm(newForm);

    isSubmitted.current = true;
  };

  return (
    <form onSubmit={handleSubmit(onVoiceFormSubmit)}>
      <Stack align="center">
        {isFetching && (
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
            size="lg"
            type="submit"
            variant="light"
          >
            <Icon height={24} icon="material-symbols:send-outline" width={24} />
          </ActionIcon>
        </Group>
      </Stack>
    </form>
  );
};

export { VoiceForm };
