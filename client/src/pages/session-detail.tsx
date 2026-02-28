import { useParams } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSession } from '@/hooks/use-sessions';
import { useUnit } from '@/hooks/use-profile';
import { displayWeight } from '@/lib/units';
import { ArrowLeft, Clock, Dumbbell, Loader2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function SessionDetailPage() {
    const { sessionId } = useParams({ strict: false }) as { sessionId: string };
    const { data, isLoading } = useSession(sessionId);
    const unit = useUnit();

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    const session = data?.session;
    if (!session) {
        return (
            <div className="mx-auto w-full max-w-2xl px-4 py-12 text-center">
                <p className="text-muted-foreground">Session not found</p>
            </div>
        );
    }

    // Sort exercises by program block display order (matches program structure)
    const exercises = [...(session.exercises ?? [])].sort(
        (a: any, b: any) => (a.programBlock?.displayOrder ?? 0) - (b.programBlock?.displayOrder ?? 0)
    );
    const totalSets = exercises.reduce((acc: number, ex: any) => acc + (ex.sets?.length ?? 0), 0);
    const totalVolume = exercises.reduce(
        (acc: number, ex: any) =>
            acc + (ex.sets ?? []).reduce((setAcc: number, s: any) => setAcc + s.weight * s.reps, 0),
        0
    );

    return (
        <div className="mx-auto w-full max-w-2xl px-4 py-6">
            {/* Back link — hidden on mobile (bottom nav handles navigation) */}
            <Link
                to="/training"
                className="mb-4 hidden items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground md:inline-flex"
            >
                <ArrowLeft className="size-4" />
                Training History
            </Link>

            {/* Session header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-foreground">{session.title ?? 'Training Session'}</h1>
                <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                    <span>
                        {new Date(session.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </span>
                    {session.durationMinutes != null && (
                        <span className="flex items-center gap-1">
                            <Clock className="size-3.5" />
                            {session.durationMinutes} min
                        </span>
                    )}
                    <span className="flex items-center gap-1">
                        <Dumbbell className="size-3.5" />
                        {totalSets} sets
                    </span>
                    <span>{Math.round(totalVolume).toLocaleString()} kg</span>
                </div>
                {session.notes && <p className="mt-2 text-sm text-muted-foreground italic">{session.notes}</p>}
            </div>

            {/* Exercises */}
            <div className="flex flex-col gap-4">
                {exercises.map((exercise: any, i: number) => {
                    const label = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i] ?? `${i + 1}`;
                    const movements = exercise.programBlock?.movements ?? [];
                    const sortedMovements = [...movements].sort(
                        (a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
                    );
                    const isComplex = sortedMovements.length > 1;
                    const exerciseName = isComplex
                        ? sortedMovements.map((m: any) => m.lift?.name ?? 'Unknown').join(' + ')
                        : exercise.lift.name;
                    // For complexes, show per-movement rep breakdown: (2+1+1)
                    const repBreakdown = isComplex
                        ? `(${sortedMovements.map((m: any) => m.reps ?? 1).join('+')})`
                        : null;
                    const targetSets = exercise.programBlock?.sets ?? null;
                    const targetReps = isComplex
                        ? repBreakdown
                        : (sortedMovements[0]?.reps ?? exercise.programBlock?.reps ?? null);
                    const upToPercent = exercise.programBlock?.upToPercent ?? null;

                    return (
                        <Card key={exercise.id} className="border-border/60">
                            <CardHeader className="pb-3">
                                <div className="flex items-start gap-3">
                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-mono text-sm font-bold text-primary">
                                        {label}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <CardTitle className="text-sm font-semibold">{exerciseName}</CardTitle>
                                        {targetSets != null && targetReps != null && (
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {targetSets} &times; {targetReps}
                                                {upToPercent != null && (
                                                    <span className="ml-1.5 text-muted-foreground/60">
                                                        | up to {upToPercent}%
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                    <Badge variant="outline" className="shrink-0 text-xs">
                                        {exercise.sets?.length ?? 0} sets
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {exercise.sets && exercise.sets.length > 0 ? (
                                    <div className="rounded-lg border border-border/40">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border/40 text-xs text-muted-foreground">
                                                    <th className="px-3 py-2 text-left font-medium">#</th>
                                                    <th className="px-3 py-2 text-right font-medium">Weight</th>
                                                    <th className="px-3 py-2 text-right font-medium">Reps</th>
                                                    <th className="px-3 py-2 text-right font-medium">Type</th>
                                                    <th className="px-3 py-2 text-right font-medium">RPE</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {exercise.sets.map((set: any) => (
                                                    <tr
                                                        key={set.id}
                                                        className="border-b border-border/20 last:border-0"
                                                    >
                                                        <td className="px-3 py-2 font-mono text-muted-foreground">
                                                            {set.setNumber}
                                                        </td>
                                                        <td className="px-3 py-2 text-right font-mono font-medium">
                                                            {displayWeight(set.weight, unit)} {unit}
                                                        </td>
                                                        <td className="px-3 py-2 text-right font-mono">{set.reps}</td>
                                                        <td className="px-3 py-2 text-right text-xs text-muted-foreground">
                                                            {set.setType}
                                                        </td>
                                                        <td className="px-3 py-2 text-right font-mono text-muted-foreground">
                                                            {set.rpe ?? '—'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No sets logged</p>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
