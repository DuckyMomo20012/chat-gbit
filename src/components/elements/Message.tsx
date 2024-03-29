'use client';

import { Icon } from '@iconify/react';
import {
  Box,
  Center,
  Group,
  Image,
  Loader,
  Avatar as MantineAvatar,
  Tooltip,
} from '@mantine/core';
import { evaluate } from '@mdx-js/mdx';
import { useMDXComponents } from '@mdx-js/react';
import Avatar from 'boring-avatars';
import clsx from 'clsx';
import { type OpenAI } from 'openai';
import { forwardRef, useEffect, useState } from 'react';
import * as runtime from 'react/jsx-runtime';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

export type TMessageProp = {
  content: string;
  role: OpenAI.Chat.ChatCompletionRole;
  userName?: string;
  colors?: Array<string>;
  isTrained?: boolean;
};

const Message = forwardRef(function Message(
  { userName, colors, role, content, isTrained }: TMessageProp,
  ref: React.Ref<HTMLSpanElement>,
) {
  const components = useMDXComponents();
  const [parsed, setParsed] = useState<React.ReactNode>();

  useEffect(() => {
    if (!content) return;

    const evaluateBody = async () => {
      const { default: BodyContent } = await evaluate(content, {
        ...runtime,
        useMDXComponents: () => components,
        // NOTE: Sanitize the content to prevent XSS
        rehypePlugins: [
          [
            // Ref:
            // https://github.com/rehypejs/rehype-sanitize#example-syntax-highlighting
            rehypeSanitize,
            {
              ...defaultSchema,
              attributes: {
                ...defaultSchema.attributes,
                code: [
                  ...(defaultSchema.attributes?.code || []),
                  // List of all allowed languages:
                  // NOTE: Only allow className to support highlighting
                  ['className'],
                ],
              },
            },
          ],
        ],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      // NOTE: Prevent not found error
      // Ref: https://github.com/vercel/next.js/discussions/25049#discussioncomment-3987794
      setParsed(BodyContent({}));
    };

    try {
      evaluateBody();
    } catch (err) {
      console.error(err);
    }
  }, [content, components]);

  return (
    <Center
      className={clsx('w-full p-4', {
        'bg-gray-100 dark:bg-gray-700': role === 'assistant',
        'bg-pink-100 dark:bg-pink-700': role === 'system',
      })}
    >
      <Group
        className="w-full md:max-w-2xl lg:max-w-2xl xl:max-w-3xl"
        wrap="nowrap"
      >
        <Tooltip
          label={`${role.toUpperCase()}${isTrained ? '\n(TRAINED)' : ''}`}
          position="left"
        >
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

        <Box className="min-w-0 flex-1 [&>*]:break-words">
          <Box component="span" ref={ref}>
            {parsed || content}
          </Box>
        </Box>
      </Group>
    </Center>
  );
});

export { Message };
