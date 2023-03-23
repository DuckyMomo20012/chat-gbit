import { createContext, useState } from 'react';

export type TChatContext = {
  chatId: string;
  setChatId: (chatId: string) => void;
};

const ChatContext = createContext<TChatContext>({
  chatId: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setChatId: () => {},
});

const ChatProvider = ({ children }: { children?: React.ReactNode }) => {
  const [chatId, setChatId] = useState('');

  return (
    <ChatContext.Provider value={{ chatId, setChatId }}>
      {children}
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatProvider };
