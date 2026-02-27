import { Link } from '@tanstack/react-router';
import SignInForm from '@/components/forms/auth/signin';

export function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border bg-card p-8 shadow-xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
                        <p className="text-muted-foreground">Sign in to your account</p>
                    </div>

                    <SignInForm />

                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground text-sm">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary font-semibold hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
