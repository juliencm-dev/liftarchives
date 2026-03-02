import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useCoachLifterSessions,
    useCoachLifterRecords,
    useCoachPrograms,
    useAssignProgramToLifter,
    useRemoveLifter,
    useCoachLifters,
} from '@/hooks/use-coach';
import { ArrowLeft, Loader2, Activity, Trophy, Dumbbell, UserMinus } from 'lucide-react';

export function CoachLifterDetailPage() {
    const { lifterId } = useParams({ strict: false }) as { lifterId: string };
    const { data: lifters } = useCoachLifters();
    const { data: sessions, isLoading: sessionsLoading } = useCoachLifterSessions(lifterId);
    const { data: records, isLoading: recordsLoading } = useCoachLifterRecords(lifterId);
    const { data: coachPrograms } = useCoachPrograms();
    const assignProgram = useAssignProgramToLifter(lifterId);
    const removeLifter = useRemoveLifter();

    const [selectedProgramId, setSelectedProgramId] = useState<string>('');

    const lifterEntry = lifters?.find((l) => l.lifterId === lifterId);
    const lifterName = lifterEntry?.lifter.user.name ?? 'Lifter';

    const handleAssignProgram = () => {
        if (!selectedProgramId) return;
        assignProgram.mutate(
            { programId: selectedProgramId },
            {
                onSuccess: () => setSelectedProgramId(''),
            }
        );
    };

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
            <Button
                variant="link"
                asChild
                className="-ml-2 mb-2 hidden h-auto w-fit gap-1.5 px-2 py-1 text-sm md:inline-flex"
            >
                <Link to="/coach">
                    <ArrowLeft className="size-3.5" />
                    Back to Coach Dashboard
                </Link>
            </Button>

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">{lifterName}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{lifterEntry?.lifter.user.email}</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:bg-destructive/10"
                    onClick={() => removeLifter.mutate(lifterId)}
                    disabled={removeLifter.isPending}
                >
                    <UserMinus className="size-4" />
                    Remove
                </Button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                {/* Assign Program */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Dumbbell className="size-4" />
                            Assign Program
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Select a program" />
                                </SelectTrigger>
                                <SelectContent>
                                    {coachPrograms?.map((program) => (
                                        <SelectItem key={program.id} value={program.id}>
                                            {program.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={handleAssignProgram}
                                disabled={!selectedProgramId || assignProgram.isPending}
                            >
                                {assignProgram.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Assign'}
                            </Button>
                        </div>
                        {assignProgram.isSuccess && <p className="mt-2 text-sm text-primary">Program assigned!</p>}
                        {assignProgram.isError && (
                            <p className="mt-2 text-sm text-destructive">{assignProgram.error.message}</p>
                        )}
                    </CardContent>
                </Card>

                {/* PR Highlights */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Trophy className="size-4" />
                            Personal Records
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recordsLoading ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="size-5 animate-spin text-primary" />
                            </div>
                        ) : !records || records.length === 0 ? (
                            <p className="py-2 text-center text-sm text-muted-foreground">No records yet</p>
                        ) : (
                            <div className="space-y-2">
                                {records.slice(0, 8).map((record) => (
                                    <div key={record.id} className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{record.reps}RM</span>
                                        <span className="font-medium">{record.weight} kg</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Session History */}
            <Card className="mt-4">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Activity className="size-4" />
                        Session History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {sessionsLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="size-6 animate-spin text-primary" />
                        </div>
                    ) : !sessions || sessions.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                            No shared sessions from this lifter yet.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div>
                                        <p className="text-sm font-medium">
                                            {session.title ?? `Session on ${session.date}`}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {session.date}
                                            {session.durationMinutes ? ` · ${session.durationMinutes} min` : ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">
                                            {session.exercises.length} exercise
                                            {session.exercises.length !== 1 ? 's' : ''}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
