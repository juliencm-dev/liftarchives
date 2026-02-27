import { Link } from '@tanstack/react-router';
import { SignUpForm } from '@/components/forms/auth/signup';

export function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border bg-card p-8 shadow-xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Get Started</h1>
                        <p className="text-muted-foreground">Create your account</p>
                    </div>

                    <SignUpForm />

                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground text-sm">
                            Already have an account?{' '}
                            <Link to="/signin" className="text-primary font-semibold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
