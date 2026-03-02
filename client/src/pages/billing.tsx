import { BackToDashboard } from '@/components/layout/BackToDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

export function BillingPage() {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
            <BackToDashboard />
            <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground">Billing</h1>
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <CreditCard className="mb-4 size-12 text-muted-foreground/50" />
                    <p className="text-lg font-medium text-foreground">Coming soon</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Subscription management will be available here.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
