'use client';

import {
  Button,
  Center,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import Head from 'next/head';

function Error() {
  return (
    <Center className="h-full w-full flex-1 @container">
      <Head>
        <title>Server Error</title>
        <meta
          content="Server Error - Something bad just happened..."
          name="description"
        ></meta>
      </Head>
      <Stack align="center" className="min-w-4/5 w-4/5 max-w-xl @lg:w-full">
        <Image
          alt="500"
          className="aspect-[5/4]"
          height={800}
          src="https://http.cat/500"
          width={1000}
        />
        <Title className="text-center" order={1}>
          Something bad just happened...
        </Title>
        <Text c="dimmed" className="text-center" size="lg">
          Our servers could not handle your request. Don&apos;t worry, our
          development team was already notified. Try refreshing the page.
        </Text>
        <Group justify="center">
          <Button
            onClick={() => {
              window.location.reload();
            }}
            size="md"
            variant="light"
          >
            Refresh the page
          </Button>
        </Group>
      </Stack>
    </Center>
  );
}

export default Error;
