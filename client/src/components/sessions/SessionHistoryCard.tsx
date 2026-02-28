import { Card, CardContent } from '@/components/ui/card';
import { Clock, Dumbbell } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface SessionHistoryCardProps {
    session: {
        id: string;
        date: string;
        title: string | null;
        durationMinutes: number | null;
        completedAt: string | null;
        exerciseCount: number;
        totalSets: number;
        totalVolume: number;
    };
}

export function SessionHistoryCard({ session }: SessionHistoryCardProps) {
    const date = new Date(session.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });

    return (
        <Link to="/training/sessions/$sessionId" params={{ sessionId: session.id }} className="block">
            <Card className="border-border/40 transition-colors hover:border-primary/30">
                <CardContent className="flex items-center gap-4 p-4">
                    {/* Date pill */}
                    <div className="flex flex-col items-center rounded-lg bg-secondary/50 px-3 py-2 text-center">
                        <span className="text-xs font-medium text-muted-foreground">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className="font-mono text-lg font-bold text-foreground">{date.getDate()}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{session.title ?? formattedDate}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            {session.durationMinutes != null && (
                                <span className="flex items-center gap-1">
                                    <Clock className="size-3" />
                                    {session.durationMinutes} min
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <Dumbbell className="size-3" />
                                {session.totalSets} sets
                            </span>
                            <span>{Math.round(session.totalVolume).toLocaleString()} kg</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
