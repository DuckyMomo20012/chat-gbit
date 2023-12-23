import { bcryptVerify } from 'hash-wasm';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import {
  type GetServerSidePropsContext,
  type NextApiRequest,
  type NextApiResponse,
} from 'next';
import { type NextAuthOptions, getServerSession } from 'next-auth';

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const authOptions = {
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
        if (!credentials) return null;

        // Inputs from login form
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (user) {
          const isVerified = await bcryptVerify({
            password,
            hash: user.password,
          });

          if (!isVerified) return null;

          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        // NOTE: Add userId to session for use in API routes
        user: {
          ...session.user,
          id: token.sub,
          name: token.name,
          email: token.email,
        },
      };
    },
  },
  pages: {
    signIn: '/auth/sign-in',
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
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
