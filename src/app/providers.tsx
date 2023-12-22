'use client';

import '@/styles/globals.css';

import { Notifications } from '@mantine/notifications';
import NextNProgress from 'nextjs-progressbar';
import {
  MDXProvider,
  MantineProvider,
  QueryProvider,
  ReduxProvider,
} from '@/context/index';

const Providers = ({ children }: { children?: React.ReactNode }) => {
  return (
    <ReduxProvider>
      <QueryProvider>
        <MantineProvider>
          <MDXProvider>
            <NextNProgress />
            <Notifications />
            {children}
          </MDXProvider>
        </MantineProvider>
      </QueryProvider>
    </ReduxProvider>
  );
};

export default Providers;
