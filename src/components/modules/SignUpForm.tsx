import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Group,
  PasswordInput,
  Space,
  Stack,
  TextInput,
} from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { userBodySchema } from '@/pages/api/users';

export const signUpSchema = userBodySchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type TSignUpForm = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
  const router = useRouter();

  const { mutate: signUp } = useMutation({
    mutationKey: ['users', 'signUp'],
    mutationFn: async (data: TSignUpForm) => {
      const { data: user } = await axios.post('/api/users', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      return user;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignUpForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: TSignUpForm) => {
    signUp(data);

    router.push('/auth/sign-in');
  };

  return (
    <form className="h-full w-full" onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <TextInput
          error={errors.email?.message}
          label="Email"
          withAsterisk
          {...register('email')}
        />
        <TextInput
          error={errors.name?.message}
          label="Name"
          {...register('name')}
        />
        <PasswordInput
          error={errors.password?.message}
          label="Password"
          withAsterisk
          {...register('password')}
        />
        <PasswordInput
          error={errors.confirmPassword?.message}
          label="Confirm password"
          withAsterisk
          {...register('confirmPassword')}
        />

        <Space h="md" />

        <Group className="w-full" justify="center">
          <Button type="submit">Sign up</Button>
        </Group>
      </Stack>
    </form>
  );
};

export { SignUpForm };
