/* eslint-disable jsx-a11y/aria-role */
import { faker } from '@faker-js/faker';
import { Icon } from '@iconify/react';
import { ActionIcon, Space, Stack } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TypedMessage } from '@/components/elements/TypedMessage';
import { mutateMessage, setTyping } from '@/store/slice/convoSlice';
import type { TChat } from '@/store/slice/convoSlice';

const Convo = ({
  chat,
  isFetching,
}: {
  chat: Array<TChat>;
  isFetching: boolean;
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollButtonRef = useRef<HTMLButtonElement>(null);
  const intersectEntryRef = useRef<IntersectionObserverEntry>();
  const [config, setConfig] = useState<{
    userName: string;
    colors: Array<string>;
  }>({
    userName: '',
    colors: [],
  });

  const dispatch = useDispatch();

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
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          intersectEntryRef.current = entry;
          // NOTE: The scroll button is hidden by default, and only shown when
          // the bottom of the chat is not visible.
          scrollButtonRef.current?.classList.toggle(
            'hidden',
            entry.isIntersecting,
          );
        });
      },
      {
        threshold: [0.75],
      },
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Stack className="relative h-full w-full">
      <Stack className="relative w-full overflow-y-auto">
        {chat?.map((item) => {
          if (item?.hidden) return null;

          return (
            <TypedMessage
              colors={config.colors}
              content={item.content}
              isTyping={item.isTyping}
              key={item.id}
              role={item.role}
              typedOptions={(typedValRef) => {
                return {
                  onStringTyped: () => {
                    dispatch(
                      setTyping({
                        id: item.id,
                        isTyping: false,
                      }),
                    );
                  },
                  onTypingPaused: () => {
                    if (intersectEntryRef.current?.isIntersecting) {
                      bottomRef.current?.scrollIntoView({
                        behavior: 'smooth',
                      });
                    }
                  },
                  onDestroy: () => {
                    if (!typedValRef.current) return;

                    dispatch(
                      mutateMessage({
                        id: item.id,
                        mutation: {
                          isTyping: false,
                          content: typedValRef.current,
                        },
                      }),
                    );
                  },
                };
              }}
              userName={config.userName}
            />
          );
        })}

        {isFetching && (
          <TypedMessage content="" isTyping={true} role="assistant" />
        )}

        <Space className="h-72 w-full flex-shrink-0 md:h-48" ref={bottomRef} />
      </Stack>
      <ActionIcon
        className="absolute bottom-32 right-8 z-[110] hidden"
        color="indigo"
        onClick={() => {
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        radius="xl"
        ref={scrollButtonRef}
        size="lg"
        variant="light"
      >
        <Icon
          height={24}
          icon="material-symbols:arrow-circle-down-outline"
          width={24}
        />
      </ActionIcon>
    </Stack>
  );
};

export { Convo };
