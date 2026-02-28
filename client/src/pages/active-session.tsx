import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useActiveSession, useCompleteSession, useAddExercise, useBatchUploadSets } from '@/hooks/use-sessions';
import { FeedbackSelector } from '@/components/sessions/FeedbackSelector';
import { SessionSummary } from '@/components/sessions/SessionSummary';
import { RestTimer } from '@/components/sessions/RestTimer';
import { PRCelebration } from '@/components/sessions/PRCelebration';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Check, Loader2, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUnit } from '@/hooks/use-profile';
import { displayWeight, toKg } from '@/lib/units';
import { useTrainingSettings } from '@/hooks/use-training-settings';
import {
    getLocalSession,
    saveLocalSession,
    clearLocalSession,
    addLocalSet,
    removeLocalSet,
    setCurrentExercise,
    type LocalSessionData,
} from '@/lib/session-store';

export function ActiveSessionPage() {
    const { data, isLoading } = useActiveSession();
    const completeSession = useCompleteSession();
    const addExercise = useAddExercise();
    const batchUpload = useBatchUploadSets();
    const navigate = useNavigate();
    const unit = useUnit();
    const { data: settings } = useTrainingSettings();

    const [localSession, setLocalSession] = useState<LocalSessionData | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [completedSession, setCompletedSession] = useState<unknown>(null);
    const [showRestTimer, setShowRestTimer] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const [elapsed, setElapsed] = useState(0);

    // PR celebration state
    const [prList, setPrList] = useState<
        Array<{ liftName: string; weight: number; reps: number; previousBest: number | null }>
    >([]);
    const [currentPr, setCurrentPr] = useState<{
        show: boolean;
        liftName: string;
        weight: number;
        reps: number;
        previousBest: number | null;
    }>({ show: false, liftName: '', weight: 0, reps: 0, previousBest: null });

    const session = data?.session;
    const sessionId = session?.id;
    const sessionExerciseCount = session?.exercises?.length ?? 0;

    // Track whether we've already populated exercises for this session
    const populatedRef = useRef<string | null>(null);
    // Track the exercise count we last synced to local session
    const syncedCountRef = useRef(0);

    // Auto-populate exercises from program day template if empty
    useEffect(() => {
        if (!session) return;
        if (populatedRef.current === session.id) return;
        const hasExercises = session.exercises && session.exercises.length > 0;
        const programDay = (session as any).programDay;

        if (!hasExercises && programDay?.blocks && programDay.blocks.length > 0) {
            populatedRef.current = session.id;
            programDay.blocks.forEach((block: any) => {
                if (block.movements && block.movements.length > 0) {
                    const primaryMovement = block.movements[0];
                    addExercise.mutate({
                        sessionId: session.id,
                        data: {
                            liftId: primaryMovement.liftId,
                            programBlockId: block.id,
                        },
                    });
                }
            });
        }
    }, [sessionId, sessionExerciseCount]); // eslint-disable-line react-hooks/exhaustive-deps

    // Restore or initialize local session from API data
    useEffect(() => {
        if (!session) return;
        if (!session.exercises || session.exercises.length === 0) return;

        // Skip if we already synced this exact exercise count
        if (syncedCountRef.current === session.exercises.length) return;

        const existing = getLocalSession();

        // If local session already exists and has all exercises, just restore to state once
        if (existing && existing.sessionId === session.id) {
            if (existing.exercises.length >= session.exercises.length) {
                syncedCountRef.current = session.exercises.length;
                setLocalSession(existing);
                return;
            }
        }

        const local: LocalSessionData = {
            sessionId: session.id,
            title: session.title ?? null,
            startedAt: session.startedAt ?? new Date().toISOString(),
            currentExerciseIndex: existing?.currentExerciseIndex ?? 0,
            exercises: session.exercises.map((ex: any) => {
                const existingEx = existing?.exercises.find((e: any) => e.exerciseId === ex.id);

                // Get movement-specific reps (movements can override block reps)
                const matchingMovement = ex.programBlock?.movements?.find((m: any) => m.liftId === ex.liftId);
                const targetReps = matchingMovement?.reps ?? ex.programBlock?.reps ?? 5;

                return {
                    exerciseId: ex.id,
                    liftId: ex.liftId,
                    liftName: ex.lift.name,
                    liftCategory: ex.lift.category,
                    programBlockId: ex.programBlockId,
                    targetSets: ex.programBlock?.sets ?? 3,
                    targetReps,
                    upToPercent: ex.programBlock?.upToPercent ?? null,
                    oneRepMax: ex.oneRepMax ?? null,
                    sets: existingEx?.sets ?? [],
                };
            }),
        };
        syncedCountRef.current = session.exercises.length;
        saveLocalSession(local);
        setLocalSession(local);
    }, [sessionId, sessionExerciseCount]); // eslint-disable-line react-hooks/exhaustive-deps

    // Elapsed time ticker
    useEffect(() => {
        const startTime = localSession?.startedAt ?? session?.startedAt;
        if (!startTime) return;
        const start = new Date(startTime).getTime();
        const tick = () => setElapsed(Math.floor((Date.now() - start) / 60000));
        tick();
        const interval = setInterval(tick, 60000);
        return () => clearInterval(interval);
    }, [localSession?.startedAt, session?.startedAt]);

    // Redirect if no session
    useEffect(() => {
        if (!isLoading && !session) {
            navigate({ to: '/dashboard' });
        }
    }, [isLoading, session, navigate]);

    // Current exercise derived state
    const currentIndex = localSession?.currentExerciseIndex ?? 0;
    const currentExercise = localSession?.exercises[currentIndex] ?? null;
    const totalExercises = localSession?.exercises.length ?? 0;

    // Get increment for current exercise based on category
    const increment = useMemo(() => {
        if (!settings || !currentExercise) return 2.5;
        switch (currentExercise.liftCategory) {
            case 'olympic':
                return settings.olympicIncrement;
            case 'powerlifting':
                return settings.powerliftingIncrement;
            default:
                return settings.accessoryIncrement;
        }
    }, [settings, currentExercise]);

    const barWeight = settings?.barWeight ?? 20;

    // Get target weight for the current exercise (bar → upToPercent of 1RM)
    const targetWeight = useMemo(() => {
        if (!currentExercise?.upToPercent || !currentExercise?.oneRepMax) return null;
        const raw = (currentExercise.oneRepMax * currentExercise.upToPercent) / 100;
        return Math.round(raw / increment) * increment;
    }, [currentExercise?.upToPercent, currentExercise?.oneRepMax, increment]);

    // Compute planned weight for a given set number (1-indexed)
    const getPlannedWeight = useCallback(
        (setNumber: number, totalSets: number) => {
            if (!targetWeight || targetWeight <= barWeight) return barWeight;
            if (totalSets <= 1) return targetWeight;
            // Evenly space from bar to target across sets
            const jump = (targetWeight - barWeight) / (totalSets - 1);
            const raw = barWeight + jump * (setNumber - 1);
            return Math.round(raw / increment) * increment;
        },
        [targetWeight, barWeight, increment]
    );

    // Input state
    const [weight, setWeight] = useState(0);
    const [reps, setReps] = useState(5);
    const [feedback, setFeedback] = useState<'hard' | 'normal' | 'easy' | null>(null);

    // Update weight/reps when exercise changes or a set is logged
    useEffect(() => {
        if (!currentExercise) return;

        const setsLogged = currentExercise.sets.length;
        const lastSet = currentExercise.sets[setsLogged - 1];

        if (lastSet) {
            // Adjust weight based on previous set's feedback
            const plannedNext = getPlannedWeight(setsLogged + 1, currentExercise.targetSets);
            const plannedJump = plannedNext - lastSet.weight;

            let nextWeight: number;
            if (lastSet.feedback === 'hard') {
                // Stay at same weight
                nextWeight = lastSet.weight;
            } else if (lastSet.feedback === 'easy') {
                // Bigger jump: double the planned jump (or 2x increment minimum)
                nextWeight = lastSet.weight + Math.max(plannedJump * 2, increment * 2);
            } else {
                // Normal: follow planned progression (at least 1 increment)
                nextWeight = lastSet.weight + Math.max(plannedJump, increment);
            }
            setWeight(displayWeight(Math.round(nextWeight / increment) * increment, unit));
            setReps(lastSet.reps);
        } else {
            // First set → empty bar
            setWeight(displayWeight(barWeight, unit));
            setReps(currentExercise.targetReps);
        }
        setFeedback(null);
    }, [currentIndex, currentExercise?.sets.length, barWeight, increment, unit, getPlannedWeight]); // eslint-disable-line react-hooks/exhaustive-deps

    const currentSetNumber = (currentExercise?.sets.length ?? 0) + 1;
    const targetSets = currentExercise?.targetSets ?? 3;
    const isExerciseDone = currentSetNumber > targetSets;

    // Navigation between exercises
    const goToExercise = useCallback(
        (index: number) => {
            if (index < 0 || index >= totalExercises) return;
            const updated = setCurrentExercise(index);
            if (updated) setLocalSession({ ...updated });
        },
        [totalExercises]
    );

    const goNext = useCallback(() => goToExercise(currentIndex + 1), [currentIndex, goToExercise]);
    const goPrev = useCallback(() => goToExercise(currentIndex - 1), [currentIndex, goToExercise]);

    // Log a set
    const handleLogSet = useCallback(() => {
        if (!currentExercise || weight <= 0 || reps <= 0) return;

        const updated = addLocalSet(currentIndex, {
            weight: toKg(weight, unit),
            reps,
            setType: 'working',
            feedback: feedback ?? undefined,
        });

        if (updated) {
            setLocalSession({ ...updated });
            setShowRestTimer(true);
        }
    }, [currentExercise, currentIndex, weight, reps, feedback, unit]);

    // After rest timer closes
    const handleRestDone = useCallback(() => {
        setShowRestTimer(false);

        if (!localSession) return;
        const ex = localSession.exercises[currentIndex];
        if (!ex) return;

        // Auto-advance to next exercise if all sets done
        if (ex.sets.length >= ex.targetSets && currentIndex < totalExercises - 1) {
            goNext();
        }
        // Weight/reps update is handled by the effect watching sets.length
    }, [localSession, currentIndex, totalExercises, goNext, unit, increment]);

    // Delete last set (undo)
    const handleUndoLastSet = useCallback(() => {
        if (!currentExercise || currentExercise.sets.length === 0) return;
        const lastSet = currentExercise.sets[currentExercise.sets.length - 1];
        const updated = removeLocalSet(currentIndex, lastSet.localId);
        if (updated) setLocalSession({ ...updated });
    }, [currentExercise, currentIndex]);

    // Finish session — batch upload + complete
    const handleFinish = useCallback(async () => {
        if (!localSession || !session) return;
        setIsFinishing(true);

        try {
            // Collect all sets across all exercises
            const allSets = localSession.exercises.flatMap((ex) =>
                ex.sets.map((s) => ({
                    sessionExerciseId: ex.exerciseId,
                    weight: s.weight,
                    reps: s.reps,
                    setType: s.setType,
                    rpe: s.rpe,
                    feedback: s.feedback,
                }))
            );

            if (allSets.length > 0) {
                const uploadResult = await batchUpload.mutateAsync({
                    sessionId: session.id,
                    data: { sets: allSets },
                });

                if (uploadResult.prs && uploadResult.prs.length > 0) {
                    setPrList(uploadResult.prs);
                }
            }

            const result = await completeSession.mutateAsync(session.id);
            clearLocalSession();
            setCompletedSession(result);
            setShowSummary(true);
        } catch {
            // Let mutation error handling take care of it
        } finally {
            setIsFinishing(false);
        }
    }, [localSession, session, batchUpload, completeSession]);

    // Show PRs sequentially after finish
    useEffect(() => {
        if (prList.length > 0 && !currentPr.show) {
            const next = prList[0];
            setCurrentPr({
                show: true,
                liftName: next.liftName,
                weight: displayWeight(next.weight, unit),
                reps: next.reps,
                previousBest: next.previousBest ? displayWeight(next.previousBest, unit) : null,
            });
            setPrList((prev) => prev.slice(1));
        }
    }, [prList, currentPr.show, unit]);

    // Loading state
    if (isLoading || !session || !localSession) {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-background">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    // Summary after finish
    if (showSummary && completedSession) {
        return <SessionSummary result={completedSession} onClose={() => navigate({ to: '/dashboard' })} />;
    }

    const totalSetsLogged = localSession.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

    return (
        <div className="flex min-h-dvh flex-col bg-background">
            {/* PR celebration overlay */}
            <PRCelebration
                show={currentPr.show}
                liftName={currentPr.liftName}
                weight={currentPr.weight}
                reps={currentPr.reps}
                unit={unit}
                previousBest={currentPr.previousBest}
                onDone={() => setCurrentPr((p) => ({ ...p, show: false }))}
            />

            {/* Top bar */}
            <header className="flex items-center justify-between border-b border-border/40 px-4 py-3">
                <button
                    type="button"
                    onClick={() => navigate({ to: '/dashboard' })}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                </button>
                <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">{localSession.title ?? 'Training Session'}</p>
                    <p className="text-xs text-muted-foreground">
                        {elapsed} min &middot; {totalSetsLogged} sets
                    </p>
                </div>
                <Button
                    size="sm"
                    onClick={handleFinish}
                    disabled={isFinishing || totalSetsLogged === 0}
                    className="gap-1.5"
                >
                    {isFinishing ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                    Finish
                </Button>
            </header>

            {/* Exercise navigation dots */}
            <div className="flex items-center justify-center gap-2 py-3">
                {localSession.exercises.map((ex, i) => {
                    const isDone = ex.sets.length >= ex.targetSets;
                    return (
                        <button
                            key={ex.exerciseId}
                            type="button"
                            onClick={() => goToExercise(i)}
                            className={cn(
                                'size-2.5 rounded-full transition-all',
                                i === currentIndex ? 'scale-125 bg-primary' : isDone ? 'bg-primary/40' : 'bg-border'
                            )}
                        />
                    );
                })}
            </div>

            {/* Main content — centered, one exercise */}
            {currentExercise && (
                <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-8">
                    {/* Exercise name */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-foreground">{currentExercise.liftName}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {currentExercise.targetSets}&times;{currentExercise.targetReps}
                        </p>
                    </div>

                    {/* Reps counter */}
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setReps((r) => Math.max(1, r - 1))}
                            className="flex size-12 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                        >
                            <Minus className="size-5" />
                        </button>
                        <div className="flex w-24 flex-col items-center">
                            <span className="font-mono text-4xl font-bold text-foreground">{reps}</span>
                            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Reps
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setReps((r) => r + 1)}
                            className="flex size-12 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                        >
                            <Plus className="size-5" />
                        </button>
                    </div>

                    {/* Weight counter */}
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setWeight((w) => Math.max(0, w - increment))}
                            className="flex size-12 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                        >
                            <Minus className="size-5" />
                        </button>
                        <div className="flex w-24 flex-col items-center">
                            <span className="font-mono text-4xl font-bold text-foreground">{weight}</span>
                            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                {unit}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setWeight((w) => w + increment)}
                            className="flex size-12 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                        >
                            <Plus className="size-5" />
                        </button>
                    </div>

                    {/* Feedback */}
                    <FeedbackSelector value={feedback} onChange={setFeedback} />

                    {/* Set counter + log button */}
                    <div className="flex w-full max-w-xs items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            {currentExercise.sets.length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleUndoLastSet}
                                    className="text-xs text-muted-foreground underline hover:text-foreground"
                                >
                                    Undo
                                </button>
                            )}
                        </div>

                        <span className="text-sm font-medium text-muted-foreground">
                            Set {Math.min(currentSetNumber, targetSets)}/{targetSets}
                        </span>

                        {isExerciseDone ? (
                            currentIndex < totalExercises - 1 ? (
                                <Button onClick={goNext} className="gap-1.5">
                                    Next
                                    <ChevronRight className="size-4" />
                                </Button>
                            ) : (
                                <Button onClick={handleFinish} disabled={isFinishing} className="gap-1.5">
                                    {isFinishing ? (
                                        <Loader2 className="size-3.5 animate-spin" />
                                    ) : (
                                        <Check className="size-3.5" />
                                    )}
                                    Finish
                                </Button>
                            )
                        ) : (
                            <Button onClick={handleLogSet} disabled={weight <= 0 || reps <= 0} className="gap-1.5 px-6">
                                Log Set
                            </Button>
                        )}
                    </div>

                    {/* Previous / Next exercise navigation */}
                    <div className="flex w-full max-w-xs justify-between">
                        <button
                            type="button"
                            onClick={goPrev}
                            disabled={currentIndex === 0}
                            className={cn(
                                'flex items-center gap-1 text-xs text-muted-foreground',
                                currentIndex === 0 ? 'invisible' : 'hover:text-foreground'
                            )}
                        >
                            <ChevronLeft className="size-3.5" />
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            disabled={currentIndex >= totalExercises - 1}
                            className={cn(
                                'flex items-center gap-1 text-xs text-muted-foreground',
                                currentIndex >= totalExercises - 1 ? 'invisible' : 'hover:text-foreground'
                            )}
                        >
                            Next
                            <ChevronRight className="size-3.5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Rest timer overlay */}
            <RestTimer show={showRestTimer} onClose={handleRestDone} />
        </div>
    );
}
