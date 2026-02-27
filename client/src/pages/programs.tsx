import { Calendar } from 'lucide-react';

export function ProgramsPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold">Programs</h1>
            <p className="text-muted-foreground mt-1">
                Browse training programs, create your own, and manage your schedule.
            </p>

            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <Calendar className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">Coming soon</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                    Training programs and scheduling will appear here
                </p>
            </div>
        </div>
    );
}
