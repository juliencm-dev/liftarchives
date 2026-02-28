import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { GraduationCap, Loader2 } from 'lucide-react';

import { useCoachProfile, useUpdateCoachProfile } from '@/hooks/use-profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function CoachProfileCard() {
    const { data: profile, isLoading: isLoadingProfile } = useCoachProfile();
    const updateCoachProfile = useUpdateCoachProfile();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        defaultValues: {
            bio: profile?.bio ?? '',
        },
        onSubmit: async ({ value }) => {
            setIsLoading(true);
            try {
                await updateCoachProfile.mutateAsync({ bio: value.bio || undefined });
                toast.success('Coach profile updated');
            } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Failed to update coach profile');
            } finally {
                setIsLoading(false);
            }
        },
    });

    if (isLoadingProfile) return null;
    if (!profile) return null;

    return (
        <Card className="border-border/60">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <GraduationCap className="size-4 text-primary" />
                    Coach Profile
                </CardTitle>
            </CardHeader>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <form.Field
                            name="bio"
                            children={(field) => (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor={field.name} className="text-sm text-muted-foreground">
                                        Bio
                                    </Label>
                                    <Textarea
                                        id={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="Tell lifters about your coaching experience and approach..."
                                        rows={4}
                                        maxLength={1000}
                                        className="rounded-lg border-border/60 bg-secondary/50 text-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
                                    />
                                    <p className="text-xs text-muted-foreground text-right">
                                        {field.state.value.length}/1000
                                    </p>
                                </div>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="mt-2 h-11 w-full rounded-xl font-semibold"
                        >
                            {isLoading ? <Loader2 className="size-4 animate-spin" /> : 'Save Changes'}
                        </Button>
                    </div>
                </CardContent>
            </form>
        </Card>
    );
}
