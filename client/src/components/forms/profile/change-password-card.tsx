import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

import { useChangePassword } from '@/hooks/use-profile';
import { CollapsibleCard } from '@/components/ui/collapsible-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const inputStyles =
    'h-10 rounded-lg border-border/60 bg-secondary/50 pr-10 text-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20';

export function ChangePasswordCard() {
    const changePassword = useChangePassword();
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const form = useForm({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
        onSubmit: async ({ value }) => {
            if (value.newPassword !== value.confirmNewPassword) {
                toast.error('Passwords do not match');
                return;
            }

            setIsLoading(true);
            try {
                await changePassword.mutateAsync({
                    currentPassword: value.currentPassword,
                    newPassword: value.newPassword,
                });
                toast.success('Password changed successfully');
                form.reset();
            } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Failed to change password');
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <CollapsibleCard icon={<Lock className="size-4 text-primary" />} title="Change Password">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <div className="flex flex-col gap-4">
                    <form.Field
                        name="currentPassword"
                        children={(field) => (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="current-pw" className="text-sm text-muted-foreground">
                                    Current Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="current-pw"
                                        type={showCurrent ? 'text' : 'password'}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="Enter current password"
                                        className={inputStyles}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrent(!showCurrent)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                            </div>
                        )}
                    />

                    <form.Field
                        name="newPassword"
                        children={(field) => (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="new-pw" className="text-sm text-muted-foreground">
                                    New Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="new-pw"
                                        type={showNew ? 'text' : 'password'}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="Enter new password"
                                        className={inputStyles}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew(!showNew)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                            </div>
                        )}
                    />

                    <form.Field
                        name="confirmNewPassword"
                        children={(field) => (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="confirm-pw" className="text-sm text-muted-foreground">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirm-pw"
                                        type={showConfirm ? 'text' : 'password'}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="Confirm new password"
                                        className={inputStyles}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                            </div>
                        )}
                    />

                    <Button type="submit" disabled={isLoading} className="mt-2 h-11 w-full rounded-xl font-semibold">
                        {isLoading ? <Loader2 className="size-4 animate-spin" /> : 'Change Password'}
                    </Button>
                </div>
            </form>
        </CollapsibleCard>
    );
}
