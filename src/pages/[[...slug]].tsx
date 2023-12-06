import { Icon } from '@iconify/react';
import { Button, Stack, Text } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Head from 'next/head';
import { type OpenAI } from 'openai';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Convo } from '@/components/modules/Convo';
import { PromptForm } from '@/components/modules/PromptForm';
import { VoiceForm } from '@/components/modules/VoiceForm';
import {
  addCompletion,
  addPrompt,
  addSystemMessage,
  clearTypingMessage,
  removeMessage,
  selectAllConvo,
} from '@/store/slice/convoSlice';
import type { RootState } from '@/store/store';

export type TPromptForm = {
  prompt: string;
  asSystemMessage: boolean;
};

const HomePage = () => {
  const chat = useSelector(selectAllConvo);
  const lastMessage = useSelector((state: RootState) =>
    selectAllConvo(state).at(-1),
  );
  const model = useSelector((state: RootState) => state.model);
  const isTyping = chat.filter((item) => item.isTyping).length > 0;
  const dispatch = useDispatch();

  const [inputMode, setInputMode] = useState<'voice' | 'text'>('text');

  const {
    data: completion,
    isPending,
    mutate,
  } = useMutation({
    mutationFn: async (): Promise<OpenAI.Chat.ChatCompletion> => {
      const { data } = await axios.post('/api/completions', {
        data: {
          model: model.chat.name,
          messages: chat.map((item) => ({
            role: item.role,
            content: item.content,
          })),
        },
      });

      return data;
    },
    onSuccess: (data) => {
      if (data.choices[0].message?.content) {
        dispatch(
          addCompletion({
            ...completion,
            content: data.choices[0].message?.content,
            isTyping: true,
          }),
        );
      }
    },
  });

  const isBusy = isPending || isTyping;

  const allowRegenerate = useMemo(() => {
    return !isBusy && lastMessage && lastMessage.role !== 'system';
  }, [lastMessage, isBusy]);

  const allowSystemMessage = chat.length === 0;

  const submitPrompt = async (data: TPromptForm) => {
    if (isBusy) return;

    if (data?.asSystemMessage) {
      dispatch(
        addSystemMessage({
          content: data.prompt,
          isTyping: false,
        }),
      );
      return;
    }

    dispatch(
      addPrompt({
        content: data.prompt,
        isTyping: false,
      }),
    );

    // NOTE: Submit prompt
    mutate();
  };

  return (
    <Stack
      align="center"
      className="h-[calc(100dvh_-_var(--app-shell-header-offset)_-_var(--app-shell-footer-offset)_-_var(--app-shell-padding)_*_2)]"
    >
      <Head>
        <title>New Chat</title>
        <meta content="Create new Chat GBiT" name="description"></meta>
      </Head>

      <Convo chat={chat} isFetching={isPending} />

      <Stack className="absolute bottom-0 z-[100] w-screen pb-4">
        <Stack align="center" className="p-4 backdrop-blur-xl backdrop-filter">
          {isTyping && (
            <Button
              leftSection={
                <Icon
                  height={16}
                  icon="material-symbols:stop-outline"
                  width={16}
                />
              }
              onClick={() => {
                dispatch(clearTypingMessage());
              }}
              variant="outline"
            >
              Stop generating
            </Button>
          )}

          {allowRegenerate && (
            <Button
              leftSection={
                <Icon
                  height={16}
                  icon="material-symbols:autorenew"
                  width={16}
                />
              }
              onClick={() => {
                // NOTE: Remove last message if it's assistant's message before
                // regenerating
                if (lastMessage?.role === 'assistant') {
                  dispatch(removeMessage(lastMessage.id));
                }

                mutate();
              }}
              variant="outline"
            >
              Regenerate response
            </Button>
          )}

          <Stack align="center" className="w-full">
            <Button
              className="self-center"
              color="lime"
              leftSection={
                <Icon
                  height={24}
                  icon={
                    inputMode === 'text'
                      ? 'material-symbols:voice-chat-outline'
                      : 'material-symbols:keyboard-alt-outline'
                  }
                  width={24}
                />
              }
              onClick={() => {
                setInputMode((prev) => (prev === 'text' ? 'voice' : 'text'));
              }}
              variant="light"
            >
              {inputMode === 'text' ? 'Voice input' : 'Text input'}
            </Button>

            {inputMode === 'text' && (
              <PromptForm
                allowSystemMessage={allowSystemMessage}
                isBusy={isBusy}
                submitPrompt={submitPrompt}
              />
            )}

            {inputMode === 'voice' && (
              <VoiceForm
                allowSystemMessage={allowSystemMessage}
                isBusy={isBusy}
                submitPrompt={submitPrompt}
              />
            )}
          </Stack>

          <Text c="dimmed" className="text-center" fz="sm">
            This program is designed for testing ChatGPT API only.
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default HomePage;
