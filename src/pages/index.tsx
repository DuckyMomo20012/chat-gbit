import { Icon } from '@iconify/react';
import { ActionIcon, Button, Stack, Text, TextInput } from '@mantine/core';
import Head from 'next/head';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import type Typed from 'typed.js';
import { Convo } from '@/components/modules/Convo';
import { addMessage, mutateMessage } from '@/store/slice/convoSlice';
import type { RootState } from '@/store/store';

type TFormData = {
  prompt: string;
};

const HomePage = () => {
  const chat = useSelector((state: RootState) => state.convo);
  const isTyping = chat.filter((item) => item.isTyping).length > 0;
  const dispatch = useDispatch();

  const typingsRef = useRef<
    Map<string, { node: HTMLSpanElement; typed: Typed }>
  >(new Map());

  const { register, reset, handleSubmit, setFocus } = useForm();

  useEffect(() => {
    setFocus('prompt');
  }, [setFocus, chat]);

  const onSubmit = (data: TFormData) => {
    if (isTyping) return;

    reset();
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
        <form onSubmit={handleSubmit(onSubmit)}>
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
            <TextInput
              className="w-full md:w-1/2"
              rightSection={
                <ActionIcon
                  color="blue"
                  loading={isTyping}
                  size="md"
                  type="submit"
                  variant="light"
                >
                  <Icon height={16} icon="material-symbols:send-outline" />
                </ActionIcon>
              }
              size="lg"
              {...register('prompt', {
                required: true,
              })}
            />
            <Text align="center" color="dimmed" fz="sm">
              This program is designed for testing ChatGPT API only.
            </Text>
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
};

export default HomePage;
