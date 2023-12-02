// eslint-disable-next-line import/no-unresolved
import 'windi.css';
import '@mantine/core/styles.css';

import type { NextComponentType } from 'next';
import type { AppProps } from 'next/app';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import NextNProgress from 'nextjs-progressbar';
import { AppShell } from '@/components/layouts/AppShell';
import {
  AuthGuard,
  MDXProvider,
  MantineProvider,
  QueryProvider,
  ReduxProvider,
} from '@/context/index';

type CustomProps = {
  session?: Session;
};

type CustomAppProps = AppProps<CustomProps> & {
  Component: NextComponentType & {
    auth?: boolean;
    getLayout?: (page: React.ReactNode) => React.ReactNode;
  };
};

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <ReduxProvider>
      <SessionProvider session={session}>
        <QueryProvider>
          <MantineProvider>
            <MDXProvider>
              <NextNProgress />
              {/* Guarding pages */}
              <AppShell>
                {Component.auth ? (
                  <AuthGuard>
                    {getLayout(<Component {...pageProps} />)}
                  </AuthGuard>
                ) : (
                  getLayout(<Component {...pageProps} />)
                )}
              </AppShell>
            </MDXProvider>
          </MantineProvider>
        </QueryProvider>
      </SessionProvider>
    </ReduxProvider>
  );
}

export default MyApp;
