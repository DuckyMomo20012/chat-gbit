import { AppShell as MantineAppShell } from '@mantine/core';
import { Footer } from '@/components/layouts/Footer';
import { Header } from '@/components/layouts/Header';

const AppShell = ({ children }: { children?: React.ReactNode }) => {
  return (
    <MantineAppShell
      footer={{ height: 20 }}
      header={{ height: 60 }}
      padding="md"
    >
      <MantineAppShell.Header>
        <Header />
      </MantineAppShell.Header>

      <MantineAppShell.Main className="flex flex-col">
        {children}
      </MantineAppShell.Main>

      <MantineAppShell.Footer>
        <Footer />
      </MantineAppShell.Footer>
    </MantineAppShell>
  );
};

export { AppShell };
