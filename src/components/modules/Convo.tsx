/* eslint-disable jsx-a11y/aria-role */
import { faker } from '@faker-js/faker';
import { Icon } from '@iconify/react';
import { ActionIcon, Space, Stack } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import {
  TTypedMessageHandle,
  TypedMessage,
} from '@/components/elements/TypedMessage';
import { type GetOneChat } from '@/pages/api/users/[userId]/chat/[chatId]';

const Convo = ({
  chat,
  typingRefs,
  typingMsgs,
  setTypingMsgs,
}: {
  chat: GetOneChat['messages'] | undefined;
  typingRefs: React.MutableRefObject<
    {
      id: string;
      ref: TTypedMessageHandle | null;
    }[]
  >;
  typingMsgs: string[];
  setTypingMsgs: React.Dispatch<React.SetStateAction<string[]>>;
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
          if (item?.isHidden) return null;

          const isTyping = !!typingMsgs.find((msgId) => msgId === item.id);

          return (
            <TypedMessage
              colors={config.colors}
              content={item.content}
              isTrained={item.isTrained}
              isTyping={isTyping}
              // NOTE: We have to combine the key with the updatedAt field, so
              // it will re-render after regeneration.
              key={`${item.id}-${item.updatedAt}`}
              ref={(handle) => {
                if (!handle) {
                  return;
                }

                // NOTE: We only update the handle here, NOT add new handle, so
                // we don't have to check for isTyping.
                if (handle) {
                  const newTypingRefs = typingRefs?.current.map((msg) => {
                    if (msg.id === item.id) {
                      return {
                        ...msg,
                        ref: handle,
                      };
                    }
                    return msg;
                  });

                  typingRefs.current = newTypingRefs;
                }
              }}
              role={item.role}
              typedOptions={() => {
                return {
                  onStringTyped: () => {
                    const currentRef = typingRefs?.current.find(
                      (msg) => msg.id === item.id,
                    );

                    if (currentRef) {
                      currentRef.ref?.stop();

                      typingRefs.current = typingRefs?.current.filter(
                        (msg) => msg.id !== item.id,
                      );

                      setTypingMsgs((prev) =>
                        prev.filter((msg) => msg !== item.id),
                      );
                    }
                  },
                };
              }}
              userName={config.userName}
            />
          );
        })}

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
