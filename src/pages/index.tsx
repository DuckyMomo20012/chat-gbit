import { faker } from '@faker-js/faker';
import { Icon } from '@iconify/react';
import {
  ActionIcon,
  Box,
  Button,
  Space,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Typed from 'typed.js';
import type { TChat } from '@/components/elements/Message';
import { Message } from '@/components/elements/Message';
import { addMessage } from '@/store/slice/convoSlice';
import type { RootState } from '@/store/store';

type TFormData = {
  prompt: string;
};

const HomePage = () => {
  const chat = useSelector((state: RootState) => state.convo);
  const dispatch = useDispatch();
  const [config, setConfig] = useState<{
    userName: string;
    colors: Array<string>;
  }>({
    userName: '',
    colors: [],
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef<Typed>(null);
  const typeWriterEl = useRef<HTMLSpanElement>(null);

  const [completion, setCompletion] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const { register, reset, handleSubmit, setFocus } = useForm();

  useEffect(() => {
    const fakeName = faker.name.fullName();
    const fakeColors = [
      faker.color.rgb({ format: 'hex' }),
      faker.color.rgb({ format: 'hex' }),
      faker.color.rgb({ format: 'hex' }),
      faker.color.rgb({ format: 'hex' }),
      faker.color.rgb({ format: 'hex' }),
    ];

    setConfig({
      userName: fakeName,
      colors: fakeColors,
    });
  }, []);

  useEffect(() => {
    setFocus('prompt');
    bottomRef.current?.scrollIntoView();
  }, [setFocus, chat]);

  useEffect(() => {
    if (isTyping === false && completion !== '') {
      setCompletion('');
      dispatch(addMessage({ type: 'completion', text: completion }));
    }
  }, [completion, isTyping, dispatch]);

  useEffect(() => {
    if (completion) {
      typedRef.current = new Typed(typeWriterEl.current, {
        strings: [completion.replace(/(\w+)/g, '`$1`')],
        typeSpeed: 200,
        cursorChar: '█',
        onStringTyped: () => {
          setIsTyping(false);
        },
      });

      return () => {
        typedRef.current?.destroy();
      };
    }
  }, [completion]);

  const onSubmit = (data: TFormData) => {
    reset();
    setIsTyping(true);
    dispatch(
      addMessage({
        type: 'prompt',
        text: data.prompt,
      }),
    );

    setCompletion(
      'Treat refs as an escape hatch. Refs are useful when you work with external systems or browser APIs. If much of your application logic and data flow relies on refs, you might want to rethink your approach.',
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

      <Stack className="w-full relative overflow-y-auto" ref={containerRef}>
        {chat.map((item) => {
          return (
            <Message
              colors={config.colors}
              key={item.id}
              text={item.text}
              type={item.type}
              userName={config.userName}
            />
          );
        })}

        {isTyping && (
          <Message
            text={
              <Box
                component="span"
                ref={(node: HTMLSpanElement) => {
                  // NOTE: Urgh, too much steps just to scroll to bottom on new
                  // word typed. I'm sure there's a better way to do this.
                  const observer = new MutationObserver((mutationList) => {
                    mutationList.forEach(() => {
                      // NOTE: This will aggressively scroll to bottom on every
                      // new character typed.
                      bottomRef.current?.scrollIntoView({
                        behavior: 'smooth',
                      });
                    });
                  });

                  if (!node) {
                    observer.disconnect();
                    return;
                  }

                  typeWriterEl.current = node;

                  observer.observe(node, {
                    childList: true,
                  });
                }}
              />
            }
            type="completion"
          />
        )}

        <Space className="w-full h-64 md:h-48 flex-shrink-0" ref={bottomRef} />
      </Stack>

      <Stack className="absolute bottom-0 w-full">
        <ActionIcon
          className="self-end mr-8"
          color="indigo"
          onClick={() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
          radius="xl"
          size="lg"
          variant="light"
        >
          <Icon height={24} icon="ic:outline-arrow-circle-down" width={24} />
        </ActionIcon>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack align="center" className="dark:bg-black bg-white p-4">
            {isTyping && (
              <Button
                leftIcon={
                  <Icon height={16} icon="ic:outline-stop" width={16} />
                }
                onClick={() => {
                  setIsTyping(false);
                  setCompletion('');

                  dispatch(
                    addMessage({
                      type: 'completion',
                      text: typeWriterEl.current.innerText.slice(0, -1),
                    }),
                  );
                }}
                variant="outline"
              >
                Stop generating
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
                  <Icon height={16} icon="ic:outline-send" />
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
