import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { Dumbbell, Loader2 } from 'lucide-react';

import { useLifterProfile, useCreateLifterProfile, useUpdateLifterProfile } from '@/hooks/use-profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';

const inputStyles =
    'h-10 rounded-lg border-border/60 bg-secondary/50 text-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20';
const selectTriggerStyles =
    'h-10 w-full rounded-lg border-border/60 bg-secondary/50 text-foreground focus:border-primary/50 focus:ring-primary/20';

function ProfileFormFields({
    form,
    isLoading,
    isCreate,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any;
    isLoading: boolean;
    isCreate: boolean;
}) {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <CardContent>
                <div className="flex flex-col gap-4">
                    <form.Field
                        name="dateOfBirth"
                        children={(field: {
                            name: string;
                            state: { value: string };
                            handleChange: (v: string) => void;
                        }) => (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor={field.name} className="text-sm text-muted-foreground">
                                    Date of Birth
                                </Label>
                                <DatePicker
                                    value={field.state.value}
                                    onChange={(v) => field.handleChange(v)}
                                    placeholder="Select your date of birth"
                                />
                            </div>
                        )}
                    />

                    <form.Field
                        name="weight"
                        children={(field: {
                            name: string;
                            state: { value: number };
                            handleBlur: () => void;
                            handleChange: (v: number) => void;
                        }) => (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor={field.name} className="text-sm text-muted-foreground">
                                    Weight
                                </Label>
                                <Input
                                    id={field.name}
                                    type="number"
                                    step="0.1"
                                    value={field.state.value || ''}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value ? parseFloat(e.target.value) : 0)
                                    }
                                    placeholder="Enter your weight"
                                    className={inputStyles}
                                />
                            </div>
                        )}
                    />

                    <div className="grid grid-cols-3 gap-3">
                        <form.Field
                            name="gender"
                            children={(field: { state: { value: string }; handleChange: (v: string) => void }) => (
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm text-muted-foreground">Gender</Label>
                                    <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                        <SelectTrigger className={selectTriggerStyles}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        />

                        <form.Field
                            name="liftUnit"
                            children={(field: { state: { value: string }; handleChange: (v: string) => void }) => (
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm text-muted-foreground">Unit</Label>
                                    <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                        <SelectTrigger className={selectTriggerStyles}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kg">Kg</SelectItem>
                                            <SelectItem value="lb">Lb</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        />

                        <form.Field
                            name="competitiveDivision"
                            children={(field: { state: { value: string }; handleChange: (v: string) => void }) => (
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm text-muted-foreground">Division</Label>
                                    <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                                        <SelectTrigger className={selectTriggerStyles}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="junior">Junior</SelectItem>
                                            <SelectItem value="senior">Senior</SelectItem>
                                            <SelectItem value="masters">Masters</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        />
                    </div>

                    <Button type="submit" disabled={isLoading} className="mt-2 h-11 w-full rounded-xl font-semibold">
                        {isLoading ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : isCreate ? (
                            'Create Lifter Profile'
                        ) : (
                            'Update Profile'
                        )}
                    </Button>
                </div>
            </CardContent>
        </form>
    );
}

export function LifterProfileCard() {
    const { data: profile, isLoading: isLoadingProfile } = useLifterProfile();
    const createProfile = useCreateLifterProfile();
    const updateProfile = useUpdateLifterProfile();
    const [isLoading, setIsLoading] = useState(false);

    const hasProfile = !!profile;

    const form = useForm({
        defaultValues: {
            dateOfBirth: profile?.dateOfBirth ?? '',
            weight: profile?.weight ?? 0,
            gender: (profile?.gender ?? 'male') as 'male' | 'female',
            liftUnit: (profile?.liftUnit ?? 'kg') as 'kg' | 'lb',
            competitiveDivision: (profile?.competitiveDivision ?? 'senior') as 'junior' | 'senior' | 'masters',
        },
        onSubmit: async ({ value }) => {
            setIsLoading(true);
            try {
                const data = {
                    dateOfBirth: value.dateOfBirth,
                    weight: value.weight,
                    gender: value.gender,
                    liftUnit: value.liftUnit,
                    competitiveDivision: value.competitiveDivision,
                };
                if (hasProfile) {
                    await updateProfile.mutateAsync(data);
                    toast.success('Lifter profile updated');
                } else {
                    await createProfile.mutateAsync(data);
                    toast.success('Lifter profile created');
                }
            } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Failed to save lifter profile');
            } finally {
                setIsLoading(false);
            }
        },
    });

    if (isLoadingProfile) {
        return (
            <Card className="border-border/60 animate-pulse">
                <CardHeader>
                    <div className="h-5 w-32 rounded bg-muted" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="h-10 rounded bg-muted" />
                        <div className="h-10 rounded bg-muted" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-border/60">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Dumbbell className="size-4 text-primary" />
                    Lifter Profile
                </CardTitle>
            </CardHeader>

            {!hasProfile && (
                <CardContent className="pb-0">
                    <div className="mb-6 flex flex-col items-center text-center">
                        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
                            <Dumbbell className="size-6 text-primary" />
                        </div>
                        <p className="text-sm font-medium text-foreground">No lifter profile yet</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Set up your profile to start tracking lifts and progress.
                        </p>
                    </div>
                </CardContent>
            )}

            <ProfileFormFields form={form} isLoading={isLoading} isCreate={!hasProfile} />
        </Card>
    );
}
