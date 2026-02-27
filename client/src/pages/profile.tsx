import { User } from 'lucide-react';

export function ProfilePage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-muted-foreground mt-1">
                Manage your account settings, personal details, and preferences.
            </p>

            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <User className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">Coming soon</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                    Account settings and profile management will appear here
                </p>
            </div>
        </div>
    );
}
