import { Dumbbell } from 'lucide-react';

export function TrainingPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold">Training</h1>
            <p className="text-muted-foreground mt-1">
                Log sessions, track your workouts, and review training history.
            </p>

            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <Dumbbell className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">Coming soon</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Training logging and history will appear here</p>
            </div>
        </div>
    );
}
