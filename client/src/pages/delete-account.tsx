import { BackToDashboard } from '@/components/layout/BackToDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

export function DeleteAccountPage() {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
            <BackToDashboard />
            <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground">Delete Account</h1>
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <Trash2 className="mb-4 size-12 text-destructive/50" />
                    <p className="text-lg font-medium text-foreground">Coming soon</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Account deletion and data export will be available here.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
