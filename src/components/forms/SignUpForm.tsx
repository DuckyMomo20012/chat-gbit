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
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { type CreateUser, userBodySchema } from '@/app/api/users/route';

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

  const {
    setError,
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

  const { mutate: signUp } = useMutation({
    mutationKey: ['users', 'signUp'],
    mutationFn: async (formData: TSignUpForm): Promise<CreateUser> => {
      const { data } = await axios.post('/api/users', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      return data;
    },
    onSuccess: () => {
      router.push('/auth/sign-in');
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          setError('email', {
            message: 'Email already exists',
          });
        }
      }
    },
  });

  const onSubmit = (formData: TSignUpForm) => {
    signUp(formData);
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
