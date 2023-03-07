import { Icon } from '@iconify/react';
import { Button, Stack, Text } from '@mantine/core';
import Head from 'next/head';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type Typed from 'typed.js';
import { Convo } from '@/components/modules/Convo';
import { PromptForm, TFormData } from '@/components/modules/PromptForm';
import { addMessage, mutateMessage } from '@/store/slice/convoSlice';
import type { RootState } from '@/store/store';

const HomePage = () => {
  const chat = useSelector((state: RootState) => state.convo);
  const isTyping = chat.filter((item) => item.isTyping).length > 0;
  const dispatch = useDispatch();

  const typingsRef = useRef<
    Map<string, { node: HTMLSpanElement; typed: Typed }>
  >(new Map());

  const onSubmit = (data: TFormData) => {
    if (isTyping) return;

    dispatch(
      addMessage({
        role: 'user',
        content: data.prompt,
        isTyping: false,
      }),
    );

    dispatch(
      addMessage({
        role: 'assistant',
        content:
          'Treat refs as an escape hatch. Refs are useful when you work with external systems or browser APIs. If much of your application logic and data flow relies on refs, you might want to rethink your approach.',
        isTyping: true,
      }),
    );
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

      <Convo chat={chat} typingsRef={typingsRef} />

      <Stack className="absolute bottom-0 w-full">
        <Stack align="center" className="dark:bg-black bg-white p-4">
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

          {chat.length > 0 && !isTyping && (
            <Button
              leftIcon={
                <Icon
                  height={16}
                  icon="material-symbols:autorenew"
                  width={16}
                />
              }
              onClick={() => {
                //
              }}
              variant="outline"
            >
              Regenerate response
            </Button>
          )}

          <PromptForm isTyping={isTyping} onSubmit={onSubmit} />

          <Text align="center" color="dimmed" fz="sm">
            This program is designed for testing ChatGPT API only.
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default HomePage;
