import { AppShell as MantineAppShell, Overlay } from '@mantine/core';
import { useState } from 'react';
import { Footer } from '@/components/layouts/Footer';
import { Header } from '@/components/layouts/Header';
import { Navbar } from '@/components/layouts/Navbar';

const AppShell = ({ children }: { children?: React.ReactNode }) => {
  const [navBarOpened, setNavBarOpened] = useState<boolean>(false);

  return (
    <MantineAppShell
      className="relative"
      footer={<Footer />}
      header={<Header setNavBarOpened={setNavBarOpened} />}
      navbar={
        <Navbar navBarOpened={navBarOpened} setNavBarOpened={setNavBarOpened} />
      }
    >
      {navBarOpened && <Overlay color="black" opacity={0.5} zIndex={199} />}
      {children}
    </MantineAppShell>
  );
};

export { AppShell };
