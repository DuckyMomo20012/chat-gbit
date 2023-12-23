'use client';

import { Icon } from '@iconify/react';
import { Alert, Button, Group, Stack, Text } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Head from 'next/head';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { type GetOneChat } from '@/app/api/users/[userId]/chat/[chatId]/route';
import { TTypedMessageHandle } from '@/components/elements/TypedMessage';
import { PromptForm, type TPromptForm } from '@/components/forms/PromptForm';
import { VoiceForm } from '@/components/forms/VoiceForm';
import { Convo } from '@/components/modules/Convo';
import { Settings } from '@/components/modules/Settings';
import type { RootState } from '@/store/store';

const HomePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.slug?.at(0);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const currModel = useSelector((state: RootState) => state.model);

  const [inputMode, setInputMode] = useState<'voice' | 'text'>('text');

  const [isError, setIsError] = useState(false);

  const getChatId = useCallback(async () => {
    if (!id) {
      const { data } = await axios.post(`/api/users/${userId}/chat`, {
        title: 'Untitled',
      });

      await router.push(`/${data.id}`);

      return data.id;
    }

    return id;
  }, [id, userId, router]);

  const [typingMsgs, setTypingMsgs] = useState<string[]>([]);
  const typingRefs = useRef<
    {
      id: string;
      ref: TTypedMessageHandle | null;
    }[]
  >([]);

  const queryClient = useQueryClient();

  const { data: chat, isFetching } = useQuery({
    // NOTE: params.slug changes make the query refetch, not the "id", so
    // we have to pass all the slug to the queryKey
    queryKey: ['users', userId, 'chat', params?.slug],
    queryFn: async (): Promise<GetOneChat> => {
      const { data } = await axios.get(`/api/users/${userId}/chat/${id}`);

      return data;
    },
    enabled: !!params?.slug,
  });

  const lastMessage = chat?.messages && chat.messages.at(-1);

  const { isPending: isFetchingCompletions, mutate: getCompletions } =
    useMutation({
      mutationKey: ['chat', params?.slug, 'completions', 'user', userId],
      mutationFn: async ({
        model,
        chatId,
      }: {
        model: string;
        chatId: string;
      }) => {
        const { data } = await axios.post(
          `/api/users/${userId}/chat/${chatId}/completions`,
          {
            model,
            messages:
              chat?.messages.map(
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
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['users', userId, 'chat', params?.slug],
        });

        setTypingMsgs((prev) => [...prev, data.id]);

        typingRefs.current = [
          ...typingRefs.current,
          {
            id: data.id,
            ref: null,
          },
        ];
      },
      onError: () => {
        setIsError(true);
      },
    });

  const { isPending: isSubmittingPrompt, mutate: submitPrompt } = useMutation({
    mutationKey: ['chat', params?.slug, 'prompt', 'user', userId],
    mutationFn: async ({
      role,
      content,
      chatId,
    }: {
      role: 'user' | 'system';
      content: string;
      chatId: string;
    }) => {
      const { data } = await axios.post(
        `/api/users/${userId}/chat/${chatId}/prompt`,
        {
          role,
          content,
        },
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        // NOTE: We have to invalidate the whole chat, because we may create new
        // chat if the chatId is not provided
        queryKey: ['users', userId, 'chat'],
      });
    },
  });

  const { isPending: isRegenerating, mutateAsync: regenerate } = useMutation({
    mutationKey: ['chat', params?.slug, 'regenerate', 'user', userId],
    mutationFn: async ({ chatId }: { chatId: string }) => {
      const { data } = await axios.post(
        `/api/users/${userId}/chat/${chatId}/regenerate`,
        {
          model: currModel.chat.name,
        },
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users', userId, 'chat', params?.slug],
      });
    },
  });

  const { mutate: updateContent } = useMutation({
    mutationKey: ['chat', params?.slug, 'updateContent', 'user', userId],
    mutationFn: async ({
      content,
      messageId,
    }: {
      content: string;
      messageId: string;
    }) => {
      const { data } = await axios.patch(`/api/messages/${messageId}`, {
        content,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users', userId, 'chat', params?.slug],
      });
    },
  });

  const isBusy =
    isSubmittingPrompt ||
    isFetchingCompletions ||
    isRegenerating ||
    isFetching ||
    typingMsgs.length > 0;

  const allowRegenerate = useMemo(() => {
    return !isBusy && lastMessage && lastMessage.role !== 'system';
  }, [lastMessage, isBusy]);

  const allowSystemMessage = !chat || chat?.messages?.length === 0;

  const handleSubmit = async (formData: TPromptForm) => {
    if (isBusy) return;

    const chatId = await getChatId();

    submitPrompt(
      {
        role: formData?.asSystemMessage ? 'system' : 'user',
        content: formData.prompt,
        chatId,
      },
      {
        onSuccess: () => {
          // NOTE: We don't want to fetch completions for system message
          if (formData?.asSystemMessage) return;

          getCompletions({
            model: currModel.chat.name,
            chatId,
          });
        },
      },
    );
  };

  return (
    <Stack
      align="center"
      className="relative h-[calc(100dvh_-_var(--app-shell-header-offset)_-_var(--app-shell-footer-offset)_-_var(--app-shell-padding)_*_2)]"
    >
      <Head>
        <title>{chat?.title || 'Chat GBiT'}</title>
        <meta content="Create new Chat GBiT" name="description"></meta>
      </Head>

      <Convo
        chat={chat?.messages}
        setTypingMsgs={setTypingMsgs}
        typingMsgs={typingMsgs}
        typingRefs={typingRefs}
      />

      <Stack className="absolute bottom-0 left-0 right-0 z-[100] pb-4">
        <Stack align="center" className="p-4 backdrop-blur-xl backdrop-filter">
          {isError && (
            <Alert
              color="red"
              icon={
                <Icon
                  height={20}
                  icon="material-symbols:error-outline-rounded"
                  width={20}
                />
              }
              onClose={() => setIsError(false)}
              title="Error"
              withCloseButton
            >
              Something went wrong
            </Alert>
          )}

          {typingMsgs.length > 0 && (
            <Button
              leftSection={
                <Icon
                  height={16}
                  icon="material-symbols:stop-outline"
                  width={16}
                />
              }
              onClick={() => {
                typingMsgs.forEach((msgId) => {
                  const typingRef = typingRefs?.current?.find(
                    (msg) => msg.id === msgId,
                  );

                  const textContent = typingRef?.ref?.stop();

                  if (textContent) {
                    updateContent({
                      content: textContent,
                      messageId: msgId,
                    });

                    typingRefs.current = typingRefs?.current.filter(
                      (msg) => msg.id !== msgId,
                    );

                    setTypingMsgs((prev) =>
                      prev.filter((msg) => msg !== msgId),
                    );
                  }
                });
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
              onClick={async () => {
                try {
                  const data = await regenerate({
                    chatId: id as string,
                  });

                  setTypingMsgs((prev) => [...prev, data.id]);

                  typingRefs.current = [
                    ...typingRefs.current,
                    {
                      id: data.id,
                      ref: null,
                    },
                  ];
                } catch (err) {
                  setIsError(true);
                }
              }}
              variant="outline"
            >
              Regenerate response
            </Button>
          )}

          <Stack align="center" className="w-full">
            <Group>
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

              <Settings />
            </Group>

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
