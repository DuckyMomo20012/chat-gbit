import {
  Button,
  Center,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import Link from 'next/link';

const NotFound = () => {
  return (
    <Center className="h-full w-full flex-1 @container">
      <Stack align="center" className="min-w-4/5 w-4/5 max-w-xl @lg:w-full">
        <Image
          alt="404"
          className="aspect-[5/4]"
          height={800}
          src="https://http.cat/404"
          width={1000}
        />
        <Title className="text-center" order={1}>
          You have found a secret place.
        </Title>
        <Text c="dimmed" className="text-center" size="lg">
          Unfortunately, this is only a 404 page. You may have mistyped the
          address, or the page has been moved to another URL.
        </Text>
        <Group justify="center">
          <Button component={Link} href="/" size="md" variant="light">
            Take me back to home page
          </Button>
        </Group>
      </Stack>
    </Center>
  );
};

export default NotFound;
