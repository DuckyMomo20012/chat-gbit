import { Icon } from '@iconify/react';
import {
  Box,
  Center,
  Group,
  Image,
  Loader,
  Avatar as MantineAvatar,
  Text,
  Tooltip,
} from '@mantine/core';
import Avatar from 'boring-avatars';
import clsx from 'clsx';
import { forwardRef } from 'react';
import type { TChat } from '@/store/slice/convoSlice';

type TMessageProp = Pick<TChat, 'role' | 'content' | 'isTyping'> & {
  userName?: string;
  colors?: Array<string>;
};

const Message = forwardRef(function Message(
  { userName, colors, role, content, isTyping }: TMessageProp,
  ref: React.Ref<HTMLSpanElement>,
) {
  return (
    <Center
      className={clsx('w-full p-4', {
        'bg-gray-100 dark:bg-gray-700': role === 'assistant',
        'bg-pink-100 dark:bg-pink-700': role === 'system',
      })}
    >
      <Group className="w-full md:max-w-2xl lg:max-w-2xl xl:max-w-3xl" noWrap>
        <Tooltip label={role.toUpperCase()} position="left">
          <MantineAvatar
            className="self-start"
            color="indigo"
            radius="sm"
            size="md"
            variant="filled"
          >
            {role === 'system' && (
              <Icon
                height={28}
                icon="material-symbols:robot-outline"
                width={28}
              />
            )}

            {role === 'assistant' && (
              <Image
                alt="chatgpt-avatar"
                height={28}
                src="/img/chatgpt.svg"
                width={28}
              />
            )}

            {role === 'user' &&
              (userName ? (
                <Avatar
                  colors={colors}
                  name={userName}
                  size={28}
                  variant="beam"
                />
              ) : (
                <Loader size="sm" />
              ))}
          </MantineAvatar>
        </Tooltip>

        <Text className="min-w-0">
          {isTyping ? (
            <Box component="span" ref={ref} />
          ) : (
            <Text>{content}</Text>
          )}
        </Text>
      </Group>
    </Center>
  );
});

export { Message };
