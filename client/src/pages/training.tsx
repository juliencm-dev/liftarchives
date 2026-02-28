import { Dumbbell } from 'lucide-react';
import { useSessionHistory } from '@/hooks/use-sessions';
import { SessionHistoryCard } from '@/components/sessions/SessionHistoryCard';
import { ActiveSessionBanner } from '@/components/sessions/ActiveSessionBanner';

export function TrainingPage() {
    const { data, isLoading } = useSessionHistory();
    const sessions = data?.sessions ?? [];

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
            <h1 className="text-2xl font-bold">Session History</h1>
            <p className="mt-1 text-muted-foreground">Review your past training sessions and track progress.</p>

            <div className="mt-6">
                <ActiveSessionBanner />
            </div>

            {isLoading ? (
                <div className="flex min-h-[200px] items-center justify-center">
                    <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            ) : sessions.length > 0 ? (
                <div className="mt-4 flex flex-col gap-3">
                    {sessions.map((session) => (
                        <SessionHistoryCard key={session.id} session={session} />
                    ))}
                </div>
            ) : (
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                    <Dumbbell className="mb-4 size-12 text-muted-foreground/30" />
                    <p className="text-lg font-medium text-muted-foreground">No sessions yet</p>
                    <p className="mt-1 text-sm text-muted-foreground/70">
                        Start a session from the dashboard to begin tracking
                    </p>
                </div>
            )}
        </div>
    );
}
