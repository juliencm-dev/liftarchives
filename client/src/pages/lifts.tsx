import { TrendingUp } from 'lucide-react';

export function LiftsPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold">Lifts</h1>
            <p className="text-muted-foreground mt-1">
                Track your personal records and monitor lift progression over time.
            </p>

            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">Coming soon</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                    Your lift records and progression charts will appear here
                </p>
            </div>
        </div>
    );
}
