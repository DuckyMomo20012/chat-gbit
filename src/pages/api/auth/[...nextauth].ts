import { sha1 } from 'hash-wasm';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

function getOneUser() {
  const user = {
    email: 'tienvinh@gmail.com',
    name: 'Dương Tiến Vinh',
    password: '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', // 1234
  };

  return Promise.resolve({ ...user, password: user.password });
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'you@mantine.dev',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        // Inputs from login form
        const { email, password } = credentials;
        const hashPassword = await sha1(password);
        const user = await getOneUser();
        if (user && user.password === hashPassword) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return user as any;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  events: {
    signIn(message) {
      const {
        user: { name },
      } = message;
      // eslint-disable-next-line no-console
      console.log(`User: ${name} signed in`);
    },
  },
});
