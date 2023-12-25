'use client';

import {
  type ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Typed, { type TypedOptions } from 'typed.js';
import { Message, type TMessageProp } from '@/components/elements/Message';

export type TTypedMessageHandle = {
  start: () => void;
  stop: () => string | null | undefined;
};

const TypedMessage = forwardRef(function TypedMessage(
  {
    content,
    typedOptions,
    isTyping,
    ...props
  }: {
    isTyping?: boolean;
    typedOptions?: (
      messageRef: React.MutableRefObject<HTMLSpanElement | null>,
    ) => TypedOptions;
  } & TMessageProp,
  ref: ForwardedRef<TTypedMessageHandle>,
) {
  const typedRef = useRef<Typed | null>(null);
  const messageRef = useRef<HTMLSpanElement>(null);

  // NOTE: We provide content as the default value for the typedContent state,
  // so for non-typed message, it will be rendered immediately.
  const [typedContent, setTypedContent] = useState<string>(content);

  useEffect(() => {
    if (!messageRef.current) {
      return () => {};
    }

    if (!isTyping) {
      return () => {};
    }

    const typed = new Typed(messageRef.current, {
      // NOTE: A little hacky, we pause the typing for 1ms to
      // trigger the onTypingPaused event.
      strings: [
        content
          // Ref: https://stackoverflow.com/a/6234804/12512981
          .replace(/&/g, '&amp;') // NOTE: Must be done first!
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;')
          // NOTE: Replace the backticks with HTML codes to prevent the
          // Typed.js library from ignoring the backticks. Don't worry,
          // on browser, the backticks will be rendered correctly, not
          // the HTML codes.
          .replace(/`/g, '&#96;')
          // NOTE: A little hacky, we pause the typing for 1ms to
          // trigger the onTypingPaused event.
          .replace(/([^\s]+)/g, '^1 `$1`'),
      ],
      typeSpeed: 100,
      cursorChar: '█',
      ...(typedOptions && typedOptions(messageRef)),

      // NOTE: Set to full content after the typing is done, to prevent missing content.
      onComplete: () => {
        setTypedContent(content);
      },

      onTypingPaused: () => {
        setTypedContent(messageRef.current?.textContent || '');
      },
    });

    typedRef.current = typed;

    return () => {
      typed.destroy();
    };
  }, [content, typedOptions, isTyping]);

  useImperativeHandle(
    ref,
    () => {
      return {
        start: () => {
          typedRef.current?.start();
        },
        stop: () => {
          typedRef.current?.stop();

          // NOTE: We use the ref to get the textContent instead of the state,
          // so it will always return the latest textContent
          return messageRef.current?.textContent;
        },
      };
    },
    [],
  );

  return isTyping ? (
    <Message content="" ref={messageRef} {...props} />
  ) : (
    // NOTE: We use the typedContent state instead of the content prop, so it
    // won't have flashing effect that show entire content after the typing is
    // done.
    <Message content={typedContent} {...props} />
  );
});

export { TypedMessage };
