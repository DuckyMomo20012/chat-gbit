import '@mantine/core/styles.css';
import { ColorSchemeScript } from '@mantine/core';
import Providers from '@/app/providers';

export const metadata = {
  title: 'Chat GBiT',
  description: 'A simple chat app',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link href="/favicon.svg" rel="shortcut icon" />
        <link href="/favicon.ico" rel="icon" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin=""
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Quicksand:wght@700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
