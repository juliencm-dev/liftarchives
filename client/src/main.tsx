import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'sonner';
import { router } from '@/router';
import './index.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 2 * 60_000,
            gcTime: 5 * 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary fallback={<div>Something went wrong.</div>}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <RouterProvider router={router} context={{ queryClient }} />
                    <Toaster position="top-center" />
                </AuthProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    </React.StrictMode>
);
