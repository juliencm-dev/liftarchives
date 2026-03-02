import { Dumbbell } from 'lucide-react';
import { useSessionHistory } from '@/hooks/use-sessions';
import { SessionHistoryCard } from '@/components/sessions/SessionHistoryCard';
import { ActiveSessionBanner } from '@/components/sessions/ActiveSessionBanner';
import { BackToDashboard } from '@/components/layout/BackToDashboard';
import { EmptyState } from '@/components/ui/empty-state';

export function SessionHistoryPage() {
    const { data, isLoading } = useSessionHistory();
    const sessions = data?.sessions ?? [];

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
            <BackToDashboard />

            <h1 className="text-2xl font-bold">History</h1>

            <div className="mt-6">
                <ActiveSessionBanner />
            </div>

            {isLoading ? (
                <div className="flex min-h-50 items-center justify-center">
                    <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            ) : sessions.length > 0 ? (
                <div className="mt-4 flex flex-col gap-3">
                    {sessions.map((session) => (
                        <SessionHistoryCard key={session.id} session={session} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Dumbbell}
                    heading="No sessions yet"
                    subheading="Start a session from the dashboard to begin tracking"
                    className="min-h-[400px]"
                />
            )}
        </div>
    );
}
