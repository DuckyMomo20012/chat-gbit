import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';

import Link from 'next/link';

const Register = () => {
  return (
    <Container my={40} size={420}>
      <Title align="center" className="font-black">
        Welcome to our website!
      </Title>
      <Text align="center" color="dimmed" mt={5} size="sm">
        Already have an account?{' '}
        <Anchor component={Link} href="/auth/login" size="sm">
          Login
        </Anchor>
      </Text>

      <Paper mt={30} p={30} radius="md" shadow="md" withBorder>
        <TextInput label="Email" placeholder="you@mantine.dev" required />
        <PasswordInput
          label="Password"
          mt="md"
          placeholder="Your password"
          required
        />
        <PasswordInput
          label="Confirm password"
          mt="md"
          placeholder="Confirm your password"
          required
        />
        <Button fullWidth mt="xl">
          Register
        </Button>
      </Paper>
    </Container>
  );
};

export default Register;
