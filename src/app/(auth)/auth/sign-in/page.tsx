import { Card, Center, Stack, Text } from '@mantine/core';
import { type Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SignInForm } from '@/components/forms/SignInForm';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in page',
};

const SignIn = async () => {
  const session = await auth();

  if (session) {
    redirect('/');
  }

  return (
    <>
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
