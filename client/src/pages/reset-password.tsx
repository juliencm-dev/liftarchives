import { useState } from 'react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { resetPassword } from '@/lib/auth';
import { toast } from 'sonner';
import { z } from 'zod';

export function ResetPasswordPage() {
    const { token } = useSearch({ strict: false }) as { token?: string };
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl border bg-card p-8 shadow-xl">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-foreground mb-2">Invalid Link</h1>
                            <p className="text-muted-foreground mb-6">
                                This password reset link is invalid or has expired.
                            </p>
                            <Link to="/forgot-password">
                                <Button variant="default" className="w-full font-semibold">
                                    Request New Link
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const form = useForm({
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
        onSubmit: async ({ value }) => {
            if (value.newPassword !== value.confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }

            setIsLoading(true);
            const { error } = await resetPassword({
                newPassword: value.newPassword,
                token,
            });

            if (error) {
                toast.error(error.message || 'Failed to reset password');
            } else {
                toast.success('Password reset successfully');
                navigate({ to: '/signin' });
            }
            setIsLoading(false);
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border bg-card p-8 shadow-xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Reset Password</h1>
                        <p className="text-muted-foreground">Choose a new password</p>
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
                                name="newPassword"
                                validators={{
                                    onChange: ({ value }) => {
                                        const result = z
                                            .string()
                                            .min(8, 'Password must be at least 8 characters')
                                            .safeParse(value);
                                        if (!result.success) {
                                            return { message: result.error.issues[0].message };
                                        }
                                        return undefined;
                                    },
                                }}
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type="password"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="********"
                                                required
                                                className="bg-white border-border text-foreground placeholder:text-muted-foreground"
                                            />
                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    );
                                }}
                            />

                            <form.Field
                                name="confirmPassword"
                                validators={{
                                    onChangeListenTo: ['newPassword'],
                                    onChange: ({ value, fieldApi }) => {
                                        const newPassword = fieldApi.form.getFieldValue('newPassword');
                                        if (value && value !== newPassword) {
                                            return { message: 'Passwords do not match' };
                                        }
                                        return undefined;
                                    },
                                }}
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type="password"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="********"
                                                required
                                                className="bg-white border-border text-foreground placeholder:text-muted-foreground"
                                            />
                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    );
                                }}
                            />
                        </FieldGroup>
                        <Button type="submit" variant="default" disabled={isLoading} className="w-full font-semibold">
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
