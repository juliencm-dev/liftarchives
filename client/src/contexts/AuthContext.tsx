import React, { createContext, useContext, useMemo } from 'react';
import { getCurrentUser, signOut as authSignOut, signIn as authSignIn } from '@/lib/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
    user: Record<string, unknown> | null;
    isLoading: boolean;
    error: Error | null;
    signIn: (params: { email: string; password: string }) => Promise<{ error: unknown }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
        retry: false,
    });

    const signIn = async ({ email, password }: { email: string; password: string }) => {
        const { data: authData, error } = await authSignIn.email({
            email,
            password,
        });

        if (error) return { error };

        queryClient.setQueryData(['currentUser'], authData?.user ?? null);
        return { error: null };
    };

    const signOut = async () => {
        await authSignOut();
        queryClient.setQueryData(['currentUser'], null);
        queryClient.clear();
    };

    const value = useMemo(
        () => ({
            user: (data as Record<string, unknown>) ?? null,
            isLoading,
            error: error as Error | null,
            signIn,
            signOut,
        }),
        [data, isLoading, error]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
