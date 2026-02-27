import { useState } from 'react';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SignUpDataSchema } from '@liftarchives/shared';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { signUp } from '@/lib/auth';
import { z } from 'zod';

export function SignUpForm() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        onSubmit: async ({ value }) => {
            setIsLoading(true);

            try {
                const validation = SignUpDataSchema.safeParse(value);

                if (!validation.success) {
                    toast.error(validation.error.issues[0].message);
                    setIsLoading(false);
                    return;
                }

                const { data, error } = await signUp.email({
                    name: value.name,
                    email: value.email,
                    password: value.password,
                    callbackURL: 'http://localhost:3000/signin',
                } as any);

                if (error) {
                    toast.error((error as any).message || 'Failed to create account');
                    return;
                }

                if (data) {
                    toast.success('Account created successfully! Please verify your email.');
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : 'An unexpected error occurred';
                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
            className="space-y-6"
        >
            <FieldGroup>
                <form.Field
                    name="name"
                    validators={{
                        onChange: ({ value }) => {
                            const result = z.string().min(1, 'Name is required').safeParse(value);
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
                                <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="text"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    aria-invalid={isInvalid}
                                    placeholder="John Doe"
                                    required
                                    className="bg-white border-border text-foreground placeholder:text-muted-foreground"
                                />
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        );
                    }}
                />

                <form.Field
                    name="email"
                    validators={{
                        onChange: ({ value }) => {
                            const result = z.string().email('Invalid email address').safeParse(value);
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

                <form.Field
                    name="password"
                    validators={{
                        onChange: ({ value }) => {
                            const result = z.string().min(8, 'Password must be at least 8 characters').safeParse(value);
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
                                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="password"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    aria-invalid={isInvalid}
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
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
                        onChangeListenTo: ['password'],
                        onChange: ({ value, fieldApi }) => {
                            const password = fieldApi.form.getFieldValue('password');
                            if (value.length < 8) {
                                return { message: 'Please confirm your password' };
                            }
                            if (value !== password) {
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
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    className="bg-white border-border text-foreground placeholder:text-muted-foreground"
                                />
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        );
                    }}
                />
            </FieldGroup>

            <Button type="submit" variant="default" className="w-full font-semibold" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
        </form>
    );
}
