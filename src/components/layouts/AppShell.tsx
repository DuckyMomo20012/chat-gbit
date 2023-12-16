import { AppShell as MantineAppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Footer } from '@/components/layouts/Footer';
import { Header } from '@/components/layouts/Header';

const AppShell = ({
  withNavbar = false,
  children,
}: {
  withNavbar?: boolean;
  children?: React.ReactNode;
}) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <MantineAppShell
      footer={{ height: 20 }}
      header={{ height: 60 }}
      navbar={{
        width: withNavbar ? 300 : 0,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <MantineAppShell.Header>
        <Header isNavbarOpened={opened} toggleNavbar={toggle} />
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
