import { useState } from 'react';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { SignInData, SignInDataSchema } from '@liftarchives/shared';

import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { Link, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

const SignInForm = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        onSubmit: async ({ value }) => {
            setIsLoading(true);

            const data: SignInData = SignInDataSchema.parse(value);

            const { error } = await signIn(data);

            if (error) toast.error((error as any).message || 'Failed to sign in');

            setIsLoading(false);
            navigate({ to: '/dashboard' });
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
                    name="email"
                    validators={{
                        onChange: ({ value }) => {
                            const result = z
                                .string()
                                .email('A valid email address is required to sign in.')
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
                            const result = z.string().min(8, 'A password is required to sign in').safeParse(value);
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
            <div className="flex justify-end -mt-2">
                <Link to="/forgot-password" className="text-sm text-primary font-medium hover:underline">
                    Forgot password?
                </Link>
            </div>
            <Button type="submit" variant="default" disabled={isLoading} className="w-full font-semibold">
                {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
        </form>
    );
};

export default SignInForm;
