import { Icon } from '@iconify/react';
import { Button, Stack, Text } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { type OpenAI } from 'openai';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Convo } from '@/components/modules/Convo';
import { PromptForm } from '@/components/modules/PromptForm';
import { VoiceForm } from '@/components/modules/VoiceForm';
import type { RootState } from '@/store/store';

export type TPromptForm = {
  prompt: string;
  asSystemMessage: boolean;
};

const HomePage = () => {
  const router = useRouter();

  const { slug } = router.query;
  const id = slug?.at(0);

  const currModel = useSelector((state: RootState) => state.model);

  const [inputMode, setInputMode] = useState<'voice' | 'text'>('text');

  const getConvoId = useCallback(async () => {
    if (!id) {
      const { data: convo } = await axios.post(`/api/conversations`, {
        title: 'Untitled',
      });

      await router.push(`/${convo.id}`);

      return convo.id;
    }

    return id;
  }, [id, router]);

  const queryClient = useQueryClient();

  const { data: conversation, isFetching } = useQuery({
    // NOTE: router.query.slug changes make the query refetch, not the "id", so
    // we have to pass all the slug to the queryKey
    queryKey: ['conversations', router.query.slug],
    queryFn: async () => {
      try {
        // NOTE: Handle root path
        if (!id) return [];

        const { data } = await axios.get(`/api/conversations/${id}`);

        return data;
      } catch (err) {
        if (err instanceof AxiosError) {
          throw err;
        }
      }

      return [];
    },
  });

  const lastMessage = conversation?.messages && conversation.messages.at(-1);

  const { isPending: isFetchingCompletions, mutate: getCompletions } =
    useMutation({
      mutationFn: async ({
        model,
        conversationId,
      }: {
        model: string;
        conversationId: string;
      }): Promise<OpenAI.Chat.ChatCompletion> => {
        const { data } = await axios.post(
          `/api/conversations/${conversationId}/completions`,
          {
            model,
            messages:
              conversation?.messages.map(
                ({
                  role,
                  content,
                }: {
                  role: 'user' | 'assistant' | 'system';
                  content: string;
                }) => ({
                  role,
                  content,
                }),
              ) || [],
          },
        );

        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['conversations', router.query.slug],
        });
      },
    });

  const { isPending: isSubmittingPrompt, mutate: submitPrompt } = useMutation({
    mutationFn: async ({
      role,
      content,
      conversationId,
    }: {
      role: 'user' | 'system';
      content: string;
      conversationId: string;
    }): Promise<OpenAI.Chat.ChatCompletion> => {
      const { data } = await axios.post(
        `/api/conversations/${conversationId}/prompt`,
        {
          role,
          content,
        },
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['conversations', router.query.slug],
      });

      if (id) {
        getCompletions({
          model: currModel.chat.name,
          conversationId: id,
        });
      }
    },
  });

  const { isPending: isRegenerating, mutate: regenerate } = useMutation({
    mutationFn: async (): Promise<OpenAI.Chat.ChatCompletion> => {
      const { data } = await axios.post(`/api/conversations/${id}/regenerate`, {
        model: currModel.chat.name,
      });

      return data;
    },
    onSuccess: () => {
      // NOTE: Invalidate the query, because the prompt still created even if error
      queryClient.invalidateQueries({
        queryKey: ['conversations', router.query.slug],
      });
    },
  });

  const isBusy =
    isSubmittingPrompt || isFetchingCompletions || isRegenerating || isFetching;

  const allowRegenerate = useMemo(() => {
    return !isBusy && lastMessage && lastMessage.role !== 'system';
  }, [lastMessage, isBusy]);

  const allowSystemMessage = conversation?.messages?.length === 0;

  const handleSubmit = async (data: TPromptForm) => {
    if (isBusy) return;

    const conversationId = await getConvoId();

    if (data?.asSystemMessage) {
      submitPrompt({
        role: 'system',
        content: data.prompt,
        conversationId,
      });
    } else {
      submitPrompt({
        role: 'user',
        content: data.prompt,
        conversationId,
      });
    }
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

      <Convo chat={conversation?.messages} isFetching={isFetchingCompletions} />

      <Stack className="absolute bottom-0 z-[100] w-screen pb-4">
        <Stack align="center" className="p-4 backdrop-blur-xl backdrop-filter">
          {/* {isTyping && (
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
          )} */}

          {allowRegenerate && (
            <Button
              leftSection={
                <Icon
                  height={16}
                  icon="material-symbols:autorenew"
                  width={16}
                />
              }
              onClick={() => regenerate()}
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
                submitPrompt={handleSubmit}
              />
            )}

            {inputMode === 'voice' && (
              <VoiceForm
                allowSystemMessage={allowSystemMessage}
                isBusy={isBusy}
                submitPrompt={handleSubmit}
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
