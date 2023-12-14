import { Card, Center, Stack, Text } from '@mantine/core';
import Head from 'next/head';
import Link from 'next/link';
import { SignInForm } from '@/components/modules/SignInForm';

const SignIn = () => {
  return (
    <>
      <Head>
        <title>Sign in</title>
        <meta content="Sign in page" name="description"></meta>
      </Head>

      <Center className="h-full w-full flex-1">
        <Card className="w-full max-w-md" withBorder>
          <Stack gap="lg">
            <Text fw="700" fz="xl">
              Sign in
            </Text>

            <SignInForm />

            <Text>
              Do not have an account?{' '}
              <Link
                className="text-inherit no-underline hover:underline"
                href="/auth/sign-up"
              >
                Sign up
              </Link>
            </Text>
          </Stack>
        </Card>
      </Center>
    </>
  );
};

export default SignIn;