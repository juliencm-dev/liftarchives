import { Settings } from 'lucide-react';
import { BackToDashboard } from '@/components/layout/BackToDashboard';
import { ChangePasswordCard } from '@/components/forms/profile';
import { TrainingSettingsCard } from '@/components/forms/profile/training-settings-card';

export function SettingsPage() {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
            {/* Page header */}
            <div className="flex flex-col gap-1">
                <div className="hidden md:block">
                    <BackToDashboard />
                </div>
                <div className="flex items-center gap-2">
                    <Settings className="size-6 text-foreground sm:size-7" />
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Settings</h1>
                </div>
                <p className="text-sm text-muted-foreground">Manage your password and training preferences.</p>
            </div>

            <div className="mt-6 flex flex-col gap-6">
                <ChangePasswordCard />
                <TrainingSettingsCard />
            </div>
        </div>
    );
}
