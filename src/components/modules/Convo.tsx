import { faker } from '@faker-js/faker';
import { Icon } from '@iconify/react';
import { ActionIcon, Space, Stack } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Typed from 'typed.js';
import { Message, TChat } from '@/components/elements/Message';
import { mutateMessage } from '@/store/slice/convoSlice';

const Convo = ({
  chat,
  typingsRef,
}: {
  chat: Array<TChat>;
  typingsRef: React.MutableRefObject<
    Map<
      string,
      { node: HTMLSpanElement; observer: MutationObserver; typed: Typed }
    >
  >;
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

    observer.observe(bottomRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Stack className="w-full h-full relative">
      <Stack className="w-full relative overflow-y-auto">
        {chat.map((item) => {
          return (
            <Message
              colors={config.colors}
              isTyping={item.isTyping}
              key={item.id}
              ref={(node: HTMLSpanElement) => {
                // NOTE: Component unmounting, so we need to clean up.
                if (!node) {
                  typingsRef.current.get(item.id).observer.disconnect();
                  typingsRef.current.get(item.id).typed.destroy();
                  typingsRef.current.delete(item.id);
                  return;
                }

                // NOTE: Urgh, too much steps just to scroll to bottom on new
                // word typed. I'm sure there's a better way to do this.
                const observer = new MutationObserver((mutationList) => {
                  mutationList.forEach(() => {
                    // NOTE: This will only scroll to bottom if the user is at
                    // the bottom of the chat.
                    if (intersectEntryRef.current?.isIntersecting) {
                      bottomRef.current?.scrollIntoView({
                        behavior: 'smooth',
                      });
                    }
                  });
                });

                const typed = new Typed(node, {
                  strings: [item.text.replace(/(\w+)/g, '`$1`')],
                  typeSpeed: 200,
                  cursorChar: '█',
                  onStringTyped: () => {
                    dispatch(
                      mutateMessage({
                        id: item.id,
                        mutation: { isTyping: false },
                      }),
                    );
                  },
                });

                observer.observe(node, {
                  childList: true,
                });

                typingsRef.current.set(item.id, { node, observer, typed });
              }}
              text={item.text}
              type={item.type}
              userName={config.userName}
            />
          );
        })}

        <Space className="w-full h-64 md:h-48 flex-shrink-0" ref={bottomRef} />
      </Stack>
      <ActionIcon
        className="bottom-32 right-8 absolute z-1 hidden"
        color="indigo"
        onClick={() => {
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        radius="xl"
        ref={scrollButtonRef}
        size="lg"
        variant="light"
      >
        <Icon height={24} icon="ic:outline-arrow-circle-down" width={24} />
      </ActionIcon>
    </Stack>
  );
};

export { Convo };
