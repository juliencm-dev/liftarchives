import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Clock, Dumbbell, Weight, CheckCircle } from 'lucide-react';

interface SessionSummaryProps {
    result: any;
    onClose: () => void;
}

export function SessionSummary({ result, onClose }: SessionSummaryProps) {
    const session = result?.session;
    if (!session) return null;

    const exercises = session.exercises ?? [];
    const totalSets = exercises.reduce((acc: number, ex: any) => acc + (ex.sets?.length ?? 0), 0);
    const totalVolume = exercises.reduce(
        (acc: number, ex: any) =>
            acc + (ex.sets ?? []).reduce((setAcc: number, s: any) => setAcc + s.weight * s.reps, 0),
        0
    );
    const duration = session.durationMinutes ?? 0;
    const advanced = result.advanced;
    const newWeekNumber = result.newWeekNumber;

    return (
        <div className="mx-auto w-full max-w-md px-4 py-12">
            <div className="flex flex-col items-center gap-6 text-center">
                {/* Check animation */}
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/15">
                    <CheckCircle className="size-8 text-primary" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-foreground">Session Complete</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{session.title ?? 'Great work!'}</p>
                </div>

                {/* Stats grid */}
                <div className="grid w-full grid-cols-2 gap-3">
                    <Card className="border-border/40">
                        <CardContent className="flex flex-col items-center gap-1 p-4">
                            <Clock className="size-5 text-muted-foreground" />
                            <span className="font-mono text-lg font-bold">{duration}</span>
                            <span className="text-xs text-muted-foreground">minutes</span>
                        </CardContent>
                    </Card>
                    <Card className="border-border/40">
                        <CardContent className="flex flex-col items-center gap-1 p-4">
                            <Dumbbell className="size-5 text-muted-foreground" />
                            <span className="font-mono text-lg font-bold">{totalSets}</span>
                            <span className="text-xs text-muted-foreground">sets</span>
                        </CardContent>
                    </Card>
                    <Card className="border-border/40">
                        <CardContent className="flex flex-col items-center gap-1 p-4">
                            <Weight className="size-5 text-muted-foreground" />
                            <span className="font-mono text-lg font-bold">
                                {Math.round(totalVolume).toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground">kg volume</span>
                        </CardContent>
                    </Card>
                    <Card className="border-border/40">
                        <CardContent className="flex flex-col items-center gap-1 p-4">
                            <Trophy className="size-5 text-muted-foreground" />
                            <span className="font-mono text-lg font-bold">{exercises.length}</span>
                            <span className="text-xs text-muted-foreground">exercises</span>
                        </CardContent>
                    </Card>
                </div>

                {advanced && newWeekNumber && (
                    <div className="w-full rounded-xl border border-primary/20 bg-primary/5 p-4">
                        <p className="text-sm font-medium text-primary">Week advanced to Week {newWeekNumber}!</p>
                    </div>
                )}

                <Button className="mt-4 w-full" onClick={onClose}>
                    Back to Dashboard
                </Button>
            </div>
        </div>
    );
}
