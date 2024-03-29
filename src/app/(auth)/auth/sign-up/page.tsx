import { Card, Center, Stack, Text } from '@mantine/core';
import { type Metadata } from 'next';
import Link from 'next/link';
import { SignUpForm } from '@/components/forms/SignUpForm';

export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Sign up page',
};

const SignUp = () => {
  return (
    <>
      <Center className="h-full w-full flex-1">
        <Card className="w-full max-w-md" withBorder>
          <Stack gap="lg">
            <Text fw="700" fz="xl">
              Sign up
            </Text>

            <SignUpForm />

            <Text>
              Already have an account?{' '}
              <Link
                className="text-inherit no-underline hover:underline"
                href="/auth/sign-in"
              >
                Sign in
              </Link>
            </Text>
          </Stack>
        </Card>
      </Center>
    </>
  );
};

export default SignUp;
