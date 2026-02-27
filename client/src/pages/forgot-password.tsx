import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { requestPasswordReset } from '@/lib/auth';
import { toast } from 'sonner';
import { z } from 'zod';

export function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const form = useForm({
        defaultValues: {
            email: '',
        },
        onSubmit: async ({ value }) => {
            setIsLoading(true);
            const { error } = await requestPasswordReset({
                email: value.email,
                redirectTo: '/reset-password',
            });

            if (error) {
                toast.error(error.message || 'Something went wrong');
            } else {
                setSubmitted(true);
            }
            setIsLoading(false);
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border bg-card p-8 shadow-xl">
                    {submitted ? (
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-foreground mb-2">Check Your Email</h1>
                            <p className="text-muted-foreground mb-6">
                                If an account exists with that email, we've sent a password reset link. Please check
                                your inbox.
                            </p>
                            <Link to="/signin">
                                <Button variant="default" className="w-full font-semibold">
                                    Back to Sign In
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-foreground mb-2">Forgot Password</h1>
                                <p className="text-muted-foreground">
                                    Enter your email and we'll send you a reset link
                                </p>
                            </div>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    form.handleSubmit();
                                }}
                                className="space-y-6"
                            >
                                <FieldGroup>
                                    <form.Field
                                        name="email"
                                        validators={{
                                            onChange: ({ value }) => {
                                                const result = z
                                                    .string()
                                                    .email('A valid email address is required.')
                                                    .safeParse(value);
                                                if (!result.success) {
                                                    return { message: result.error.issues[0].message };
                                                }
                                                return undefined;
                                            },
                                        }}
                                        children={(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched && field.state.meta.errors.length > 0;
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        type="email"
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        aria-invalid={isInvalid}
                                                        placeholder="you@example.com"
                                                        required
                                                        className="bg-white border-border text-foreground placeholder:text-muted-foreground"
                                                    />
                                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                                </Field>
                                            );
                                        }}
                                    />
                                </FieldGroup>
                                <Button
                                    type="submit"
                                    variant="default"
                                    disabled={isLoading}
                                    className="w-full font-semibold"
                                >
                                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-muted-foreground text-sm">
                                    Remember your password?{' '}
                                    <Link to="/signin" className="text-primary font-semibold hover:underline">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
