import { db } from './db/db';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { AuthOptions, DefaultSession, getServerSession, unstable_getServerSession } from 'next-auth';

import { unstable_noStore } from 'next/cache';
import { Adapter } from 'next-auth/adapters';
import CredentialProvider from 'next-auth/providers/credentials';

import bcrypt from 'bcryptjs';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
        } & DefaultSession['user'];
    }
}

export const authConfig = {
    adapter: DrizzleAdapter(db) as Adapter,
    session: {
        strategy: 'jwt',
    },
    debug: process.env.NODE_ENV === 'development',
    logger: {
        error: console.error,
        warn: console.warn,
        info: console.log,
        debug: console.log,
    },
    secret: process.env.AUTH_SECRET as string,
    pages: {
        signIn: '/',
    },
    providers: [
        CredentialProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                const user = await db.query.users.findFirst({
                    where: (users, { eq }) => eq(users.email, credentials.email),
                });

                if (!user) return null;

                const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordCorrect) return null;

                return user;
            },
        }),
    ],
    callbacks: {
        async jwt({ token }) {
            const dbUser = await db.query.users.findFirst({
                where: (users, { eq }) => eq(users.email, token.email!),
            });

            if (!dbUser) {
                throw new Error('No user with email found');
            }

            token.id = dbUser.id;
            token.email = dbUser.email;
            token.name = dbUser.firstName + ' ' + dbUser.lastName;
            token.picture = dbUser.image;

            return token;
        },
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
            }

            return session;
        },
    },
} satisfies AuthOptions;

// Use it in server contexts
export async function auth(
    ...args:
        | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    unstable_noStore();
    const session = await getServerSession(...args, authConfig);

    return { getUser: () => session?.user };
}
