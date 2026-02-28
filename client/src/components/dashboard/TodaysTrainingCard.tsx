import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Check, LayoutGrid, Loader2, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCompleteDay } from '@/hooks/use-programs';
import { useStartSession } from '@/hooks/use-sessions';
import { ExerciseBlock } from '@/components/programs/ExerciseBlock';
import { useNavigate } from '@tanstack/react-router';
import type { ProgramBlockResponse } from '@liftarchives/shared';

interface UpNextDay {
    id: string;
    dayNumber: number;
    name: string | null;
    isCompleted: boolean;
    blocks: ProgramBlockResponse[];
}

interface UpNextCardProps {
    currentWeek: {
        weekNumber: number;
        totalWeeks: number;
        cycle: number;
        days: UpNextDay[];
    } | null;
    upNextDayId: string | null;
    hasActiveAssignment: boolean;
}

export function TodaysTrainingCard({ currentWeek, upNextDayId, hasActiveAssignment }: UpNextCardProps) {
    const [selectedDayId, setSelectedDayId] = useState<string | null>(upNextDayId);
    const completeDay = useCompleteDay();
    const startSession = useStartSession();
    const navigate = useNavigate();

    // Sync selectedDayId when upNextDayId changes (e.g. after mutation)
    useEffect(() => {
        setSelectedDayId(upNextDayId);
    }, [upNextDayId]);

    const selectedDay = currentWeek?.days.find((d) => d.id === selectedDayId) ?? null;
    const hasContent = currentWeek && currentWeek.days.length > 0;

    const handleStartSession = async () => {
        if (!selectedDay) return;
        startSession.mutate(
            { programDayId: selectedDay.id, title: selectedDay.name ?? `Day ${selectedDay.dayNumber}` },
            {
                onSuccess: () => {
                    navigate({ to: '/training/session' });
                },
            }
        );
    };

    return (
        <Card className="border-border/60">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                        <LayoutGrid className="size-4 text-primary" />
                        Current Block
                    </CardTitle>
                    {currentWeek && currentWeek.totalWeeks > 1 && (
                        <span className="text-xs text-muted-foreground">
                            Week {currentWeek.weekNumber} of {currentWeek.totalWeeks}
                            {currentWeek.cycle > 1 && ` · Cycle ${currentWeek.cycle}`}
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {hasContent ? (
                    <div className="flex flex-col gap-4">
                        {/* Day picker */}
                        <div className="flex gap-1.5 overflow-x-auto pb-1">
                            {currentWeek.days.map((day) => (
                                <button
                                    key={day.id}
                                    onClick={() => {
                                        if (!day.isCompleted) setSelectedDayId(day.id);
                                    }}
                                    className={cn(
                                        'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                                        day.id === selectedDayId
                                            ? 'bg-primary text-primary-foreground'
                                            : day.isCompleted
                                              ? 'bg-secondary/50 text-muted-foreground'
                                              : 'bg-secondary/80 text-foreground hover:bg-secondary'
                                    )}
                                    disabled={day.isCompleted}
                                >
                                    {day.isCompleted && <Check className="size-3" />}
                                    {day.name || `Day ${day.dayNumber}`}
                                </button>
                            ))}
                        </div>

                        {/* Selected day blocks */}
                        {selectedDay ? (
                            <div className="h-[35vh] max-h-80 overflow-y-auto">
                                <div className="flex flex-col gap-3">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        {selectedDay.name || `Day ${selectedDay.dayNumber}`}
                                    </p>
                                    {selectedDay.blocks.map((block) => (
                                        <ExerciseBlock key={block.id} block={block} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10">
                                    <Check className="size-5 text-primary" />
                                </div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    All days complete this week!
                                </p>
                            </div>
                        )}

                        {/* Action buttons — pinned below scroll area */}
                        {selectedDay && !selectedDay.isCompleted && (
                            <div className="mt-2 flex gap-2">
                                <Button
                                    className="flex-1 gap-2"
                                    onClick={handleStartSession}
                                    disabled={startSession.isPending}
                                >
                                    {startSession.isPending ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <Play className="size-4" />
                                    )}
                                    Start Session
                                </Button>
                                <Button
                                    variant="outline-primary"
                                    className="gap-2"
                                    onClick={() => completeDay.mutate(selectedDay.id)}
                                    disabled={completeDay.isPending}
                                >
                                    {completeDay.isPending ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <Check className="size-4" />
                                    )}
                                    Quick Complete
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                            <CalendarDays className="size-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                            {hasActiveAssignment
                                ? 'Rest day — no training scheduled'
                                : 'No training scheduled for today'}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground/70">
                            {hasActiveAssignment ? 'Enjoy your recovery!' : 'Set up a program to see your daily plan'}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
