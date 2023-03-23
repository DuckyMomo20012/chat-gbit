import { nanoid } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ChatContext } from '@/context';
import { selectAllConvoByHistory } from '@/store/slice/convoSlice';
import { RootState } from '@/store/store';

const ChatLayout = ({ children }: { children?: React.ReactNode }) => {
  const router = useRouter();
  const { slug } = router.query;
  const chatIdSlug = slug?.[0] || '';
  const { setChatId } = useContext(ChatContext);
  const isGenerated = useRef(false);

  const convos = useSelector((state: RootState) => {
    return selectAllConvoByHistory(state, chatIdSlug);
  });

  useEffect(() => {
    if (chatIdSlug !== '' && convos.length === 0) {
      router.replace('/chat');
    } else if (chatIdSlug !== '' && convos.length > 0) {
      setChatId(chatIdSlug);
    } else if (chatIdSlug === '' && !isGenerated.current) {
      setChatId(nanoid());
      isGenerated.current = true;
    }
  }, [chatIdSlug, router, convos, setChatId]);

  return <>{children}</>;
};

export { ChatLayout };
