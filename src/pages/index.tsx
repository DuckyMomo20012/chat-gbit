import { Icon } from '@iconify/react';
import { Button, Stack, Text } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Head from 'next/head';
import { CreateChatCompletionResponse } from 'openai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type Typed from 'typed.js';
import { Convo } from '@/components/modules/Convo';
import { PromptForm } from '@/components/modules/PromptForm';
import { VoiceForm } from '@/components/modules/VoiceForm';
import {
  addMessage,
  mutateMessage,
  removeMessage,
} from '@/store/slice/convoSlice';
import type { RootState } from '@/store/store';

export type TPromptForm = {
  prompt: string;
  asSystemMessage: boolean;
};

const HomePage = () => {
  const chat = useSelector((state: RootState) => state.convo);
  const lastMessage = useSelector((state: RootState) => state.convo.at(-1));
  const model = useSelector((state: RootState) => state.model);
  const isTyping = chat.filter((item) => item.isTyping).length > 0;
  const dispatch = useDispatch();

  const [inputMode, setInputMode] = useState<'voice' | 'text'>('text');

  const typingsRef = useRef<
    Map<string, { node: HTMLSpanElement; typed: Typed }>
  >(new Map());

  const status = useRef<'stop' | 'submit' | 'refetch'>('stop');
  const {
    data: completion,
    isLoading,
    mutate,
  } = useMutation({
    mutationFn: async (): Promise<CreateChatCompletionResponse> => {
      const { data } = await axios.post('/api/completions', {
        data: {
          model: model.name,
          messages: chat.map((item) => ({
            role: item.role,
            content: item.content,
          })),
        },
      });

      return data;
    },
  });

  const isBusy = isLoading || isTyping;

  useEffect(() => {
    if (status.current === 'submit') {
      mutate();
    }
  }, [chat, mutate]);

  useEffect(() => {
    if (completion && status.current !== 'stop') {
      if (completion.choices[0].message?.content) {
        dispatch(
          addMessage({
            ...completion,
            role: 'assistant',
            content: completion.choices[0].message?.content,
            isTyping: true,
          }),
        );

        status.current = 'stop';
      }
    }
  }, [completion, dispatch]);

  const allowRegenerate = useMemo(() => {
    return !isBusy && lastMessage && lastMessage.role !== 'system';
  }, [lastMessage, isBusy]);

  const allowSystemMessage = chat.length === 0;

  const submitPrompt = async (data: TPromptForm) => {
    if (isBusy) return;

    if (data?.asSystemMessage) {
      dispatch(
        addMessage({
          role: 'system',
          content: data.prompt,
          isTyping: false,
        }),
      );
      return;
    }

    if (lastMessage?.role === 'user') {
      // NOTE: Mutate last prompt message if there is no completion added
      dispatch(
        mutateMessage({
          id: lastMessage.id,
          mutation: {
            role: 'user',
            content: data.prompt,
            isTyping: false,
          },
        }),
      );
    } else {
      // NOTE: Add new prompt message if there is a completion added before this
      // message
      dispatch(
        addMessage({
          role: 'user',
          content: data.prompt,
          isTyping: false,
        }),
      );
    }

    status.current = 'submit';
  };

  return (
    <Stack
      align="center"
      className="h-[calc(100vh-var(--mantine-header-height)-var(--mantine-footer-height))] relative w-full overflow-hidden"
    >
      <Head>
        <title>New Chat</title>
        <meta content="Create new Chat GBiT" name="description"></meta>
      </Head>

      <Convo chat={chat} isFetching={isLoading} typingsRef={typingsRef} />

      <Stack className="absolute bottom-0 w-full z-100">
        <Stack align="center" className="backdrop-filter backdrop-blur-xl p-4">
          {isTyping && (
            <Button
              leftIcon={
                <Icon
                  height={16}
                  icon="material-symbols:stop-outline"
                  width={16}
                />
              }
              onClick={() => {
                typingsRef.current?.forEach((val, key) => {
                  dispatch(
                    mutateMessage({
                      id: key,
                      mutation: {
                        isTyping: false,
                        content: val.node.innerText,
                      },
                    }),
                  );
                });
              }}
              variant="outline"
            >
              Stop generating
            </Button>
          )}

          {allowRegenerate && (
            <Button
              leftIcon={
                <Icon
                  height={16}
                  icon="material-symbols:autorenew"
                  width={16}
                />
              }
              onClick={() => {
                mutate();
                status.current = 'refetch';

                // NOTE: Remove last message if it's assistant's message before
                // regenerating
                if (lastMessage?.role === 'assistant') {
                  dispatch(removeMessage({ id: lastMessage.id }));
                }
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
              leftIcon={
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

          <Text align="center" color="dimmed" fz="sm">
            This program is designed for testing ChatGPT API only.
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default HomePage;
