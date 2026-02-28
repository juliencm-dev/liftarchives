import { BackToDashboard } from '@/components/layout/BackToDashboard';
import { AccountInfoCard, LifterProfileCard, CoachProfileCard, ChangePasswordCard } from '@/components/forms/profile';
import { ChangeCompetitionProfile } from '@/components/forms/profile/competition-profile-card';

export function ProfilePage() {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
            {/* Page header */}
            <div className="flex flex-col gap-1">
                <div className="hidden md:block">
                    <BackToDashboard />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Profile</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your account settings, personal details, and preferences.
                </p>
            </div>

            <div className="mt-6 flex flex-col gap-6">
                <AccountInfoCard />

                <div className="grid gap-6 lg:grid-cols-2">
                    <LifterProfileCard />
                    <div className="flex flex-col gap-3">
                        <ChangeCompetitionProfile />
                        <ChangePasswordCard />
                    </div>
                </div>

                <CoachProfileCard />
            </div>
        </div>
    );
}
