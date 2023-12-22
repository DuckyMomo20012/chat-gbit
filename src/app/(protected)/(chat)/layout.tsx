import { AppShell } from '@/components/layouts/AppShell';
import { ChatLayout } from '@/components/layouts/ChatLayout';

const ChatPageLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <AppShell withNavbar>
      <ChatLayout>{children}</ChatLayout>
    </AppShell>
  );
};

export default ChatPageLayout;
