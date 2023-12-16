import { AppShell as MantineAppShell } from '@mantine/core';
import { Navbar } from '@/components/layouts/Navbar';

const ChatLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      <MantineAppShell.Navbar>
        <Navbar />
      </MantineAppShell.Navbar>

      {children}
    </>
  );
};

export { ChatLayout };
