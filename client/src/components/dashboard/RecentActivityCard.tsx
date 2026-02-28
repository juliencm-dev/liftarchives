import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, Trophy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Record {
    id: string;
    weight: number;
    reps: number;
    createdAt: string;
    lift: { name: string };
}

function RecentRecordItem({ record }: { record: Record }) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-secondary/50 p-3 transition-colors hover:bg-secondary">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Trophy className="size-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">New PR: {record.lift.name}</p>
                <p className="text-xs text-muted-foreground">
                    {record.weight}kg &times; {record.reps} rep
                    {record.reps !== 1 ? 's' : ''}
                </p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(record.createdAt), { addSuffix: true })}
            </span>
        </div>
    );
}

interface RecentActivityCardProps {
    recentRecords: Record[] | undefined;
}

export function RecentActivityCard({ recentRecords }: RecentActivityCardProps) {
    return (
        <Card className="border-border/60">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Clock className="size-4 text-primary" />
                    Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent>
                {recentRecords && recentRecords.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto md:max-h-80">
                        <div className="flex flex-col gap-3">
                            {recentRecords.map((record) => (
                                <RecentRecordItem key={record.id} record={record} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                            <Activity className="size-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">No recent activity</p>
                        <p className="mt-1 text-xs text-muted-foreground/70">
                            Start logging sessions to see your activity here
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
