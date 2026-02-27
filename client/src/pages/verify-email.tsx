import { useEffect, useState } from 'react';
import { Link, useSearch } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export function VerifyEmailPage() {
    const { token } = useSearch({ strict: false }) as { token?: string };
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setErrorMessage('No verification token provided.');
            return;
        }

        fetch(
            `${import.meta.env.PROD ? import.meta.env.VITE_API_URL : 'http://localhost:4000'}/api/auth/verify-email?token=${token}`,
            { credentials: 'include' }
        )
            .then(async (res) => {
                if (res.ok) {
                    setStatus('success');
                } else {
                    const body = await res.json().catch(() => null);
                    setStatus('error');
                    setErrorMessage(body?.message || 'Verification failed. The link may have expired.');
                }
            })
            .catch(() => {
                setStatus('error');
                setErrorMessage('Something went wrong. Please try again.');
            });
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border bg-card p-8 shadow-xl">
                    {status === 'loading' && (
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-foreground mb-2">Verifying...</h1>
                            <p className="text-muted-foreground">Please wait while we verify your email address.</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-foreground mb-2">Email Verified</h1>
                            <p className="text-muted-foreground mb-6">
                                Your email has been verified successfully. You can now sign in.
                            </p>
                            <Link to="/signin">
                                <Button variant="default" className="w-full font-semibold">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-foreground mb-2">Verification Failed</h1>
                            <p className="text-muted-foreground mb-6">{errorMessage}</p>
                            <Link to="/signin">
                                <Button variant="default" className="w-full font-semibold">
                                    Back to Sign In
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
