import { createAuthClient } from 'better-auth/react';

const authClient = createAuthClient({
    baseURL: import.meta.env.PROD ? import.meta.env.VITE_API_URL : 'http://localhost:4000',
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;

export const requestPasswordReset = authClient.requestPasswordReset;
export const resetPassword = authClient.resetPassword;
export const updateUser = authClient.updateUser;
export const changePassword = authClient.changePassword;

export const getCurrentUser = async () => {
    const { data: session, error } = await getSession();

    if (error) {
        throw new Error(error.message || 'Failed to fetch session');
    }

    if (!session?.user) {
        return null;
    }

    return session.user;
};
