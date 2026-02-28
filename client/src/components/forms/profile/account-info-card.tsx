import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Mail, Save, Check } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useUpdateAccount } from '@/hooks/use-profile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function AccountInfoCard() {
    const { user } = useAuth();
    const updateAccount = useUpdateAccount();
    const [isLoading, setIsLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const name = (user as { name?: string })?.name ?? '';
    const email = (user as { email?: string })?.email ?? '';
    const initial = name.charAt(0).toUpperCase();

    const form = useForm({
        defaultValues: {
            name,
        },
        onSubmit: async ({ value }) => {
            setIsLoading(true);
            try {
                await updateAccount.mutateAsync({ name: value.name });
                setSaved(true);
                toast.success('Account updated successfully');
                setTimeout(() => setSaved(false), 2000);
            } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Failed to update account');
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
            {/* Banner */}
            <div className="relative h-28 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent sm:h-32">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
            </div>

            {/* Avatar + Info */}
            <div className="relative px-4 pb-6 sm:px-6">
                <div className="-mt-10 flex flex-col items-start gap-4 sm:-mt-12 sm:flex-row sm:items-end">
                    <Avatar className="size-20 border-4 border-card shadow-lg sm:size-24">
                        <AvatarFallback className="bg-primary/20 text-2xl font-bold text-primary sm:text-3xl">
                            {initial}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 pb-1">
                        <h2 className="text-lg font-semibold text-foreground sm:text-xl">{name}</h2>
                        <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                            <Mail className="size-3.5" />
                            <span className="text-sm">{email}</span>
                        </div>
                    </div>
                </div>

                {/* Display Name Field */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="mt-6 flex flex-col gap-2"
                >
                    <Label htmlFor="display-name" className="text-sm text-muted-foreground">
                        Display Name
                    </Label>
                    <div className="flex gap-2">
                        <form.Field
                            name="name"
                            validators={{
                                onChange: ({ value }) => {
                                    const result = z.string().min(1, 'Name is required').safeParse(value);
                                    if (!result.success) return { message: result.error.issues[0].message };
                                    return undefined;
                                },
                            }}
                            children={(field) => (
                                <Input
                                    id="display-name"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="h-10 flex-1 rounded-lg border-border/60 bg-secondary/50 text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
                                />
                            )}
                        />
                        <Button type="submit" size="icon-lg" disabled={isLoading} className="shrink-0 rounded-lg">
                            {saved ? <Check className="size-4" /> : <Save className="size-4" />}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
