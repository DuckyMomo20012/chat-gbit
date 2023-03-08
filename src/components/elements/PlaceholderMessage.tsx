import { useRef } from 'react';
import Typed from 'typed.js';
import { Message } from '@/components/elements/Message';
import type { TChat } from '@/store/slice/convoSlice';

const PlaceholderMessage = ({ role }: { role: TChat['role'] }) => {
  const typingsRef = useRef<Typed>(null);

  return (
    <Message
      content=""
      isTyping={true}
      ref={(node: HTMLSpanElement) => {
        // NOTE: Component unmounting, so we need to clean up.
        if (!node) {
          typingsRef.current.destroy();
          return;
        }

        const typed = new Typed(node, {
          // NOTE: A little hacky, we pause the typing for 1ms to
          // trigger the onTypingPaused event.
          strings: [''],
          typeSpeed: 100,
          cursorChar: '█',
          loop: true,
        });

        typingsRef.current = typed;
      }}
      role={role}
    />
  );
};

export { PlaceholderMessage };
