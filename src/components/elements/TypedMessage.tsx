import { useRef } from 'react';
import Typed, { type TypedOptions } from 'typed.js';
import { Message, type TMessageProp } from '@/components/elements/Message';

const TypedMessage = ({
  loop = false,
  typedOptions,
  isTyping,
  ...props
}: {
  loop?: boolean;
  typedOptions?: (
    typedValRef: React.MutableRefObject<string | null>,
  ) => TypedOptions;
} & TMessageProp) => {
  const typingsRef = useRef<Typed | null>(null);

  const mutationObserverRef = useRef<MutationObserver | null>(null);
  const typedValRef = useRef<string | null>(null);

  return (
    <Message
      isTyping={isTyping}
      ref={(node: HTMLSpanElement) => {
        // NOTE: Component unmounting, so we need to clean up.
        if (!node) {
          typingsRef.current?.destroy();
          mutationObserverRef.current?.disconnect();
          return;
        }

        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              typedValRef.current = mutation.addedNodes[0]?.textContent;
            }
          });
        });

        observer.observe(node, {
          childList: true,
        });

        mutationObserverRef.current = observer;

        const typed = new Typed(node, {
          // NOTE: A little hacky, we pause the typing for 1ms to
          // trigger the onTypingPaused event.
          strings: [
            props.content
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
          loop,
          ...(typedOptions && typedOptions(typedValRef)),
        });

        typingsRef.current = typed;
      }}
      {...props}
    />
  );
};

export { TypedMessage };
