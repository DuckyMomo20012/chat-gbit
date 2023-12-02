import { AppShell as MantineAppShell } from '@mantine/core';
import { useState } from 'react';
import { Footer } from '@/components/layouts/Footer';
import { Header } from '@/components/layouts/Header';
import { Navbar } from '@/components/layouts/Navbar';

const AppShell = ({ children }: { children?: React.ReactNode }) => {
  const [navBarOpened, setNavBarOpened] = useState<boolean>(false);

  return (
    <MantineAppShell className="h-screen" padding={0}>
      <MantineAppShell.Header>
        <Header setNavBarOpened={setNavBarOpened} />
      </MantineAppShell.Header>

      <MantineAppShell.Navbar>
        <Navbar navBarOpened={navBarOpened} setNavBarOpened={setNavBarOpened} />
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>{children}</MantineAppShell.Main>

      <MantineAppShell.Footer>
        <Footer />
      </MantineAppShell.Footer>
    </MantineAppShell>
  );
};

export { AppShell };
