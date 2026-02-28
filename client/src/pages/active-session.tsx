import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useActiveSession, useCompleteSession, useAddExercise, useBatchUploadSets } from '@/hooks/use-sessions';
import { FeedbackSelector } from '@/components/sessions/FeedbackSelector';
import { SessionSummary } from '@/components/sessions/SessionSummary';
import { RestTimerView } from '@/components/sessions/RestTimerView';
import { PRCelebration } from '@/components/sessions/PRCelebration';
import { SessionHeader } from '@/components/sessions/SessionHeader';
import { VideoDemo } from '@/components/sessions/VideoDemo';
import { ExerciseInfo } from '@/components/sessions/ExerciseInfo';
import { MovementRepCounters } from '@/components/sessions/MovementRepCounters';
import { RepsWeightControls } from '@/components/sessions/RepsWeightControls';
import { SetCounterRow } from '@/components/sessions/SetCounterRow';
import { BlockNavigation } from '@/components/sessions/BlockNavigation';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, History, ChevronRight } from 'lucide-react';
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
    updateMovementReps,
    type LocalSessionData,
} from '@/lib/session-store';

type ViewState = 'exercise' | 'rest';

export function ActiveSessionPage() {
    const { data, isLoading, isFetching } = useActiveSession();
    const completeSession = useCompleteSession();
    const addExercise = useAddExercise();
    const batchUpload = useBatchUploadSets();
    const navigate = useNavigate();
    const unit = useUnit();
    const { data: settings } = useTrainingSettings();

    const [localSession, setLocalSession] = useState<LocalSessionData | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [completedSession, setCompletedSession] = useState<unknown>(null);
    const [viewState, setViewState] = useState<ViewState>('exercise');
    const [isFinishing, setIsFinishing] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [activeMovementIndex, setActiveMovementIndex] = useState(0);

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

        // Only carry over exercise index if existing local session is for the same session
        const isSameSession = existing?.sessionId === session.id;

        // Sort exercises by block display order (mutations may resolve out of order)
        const sortedExercises = [...session.exercises].sort(
            (a: any, b: any) => (a.programBlock?.displayOrder ?? 0) - (b.programBlock?.displayOrder ?? 0)
        );

        const local: LocalSessionData = {
            sessionId: session.id,
            title: session.title ?? null,
            startedAt: session.startedAt ?? new Date().toISOString(),
            currentExerciseIndex: isSameSession ? (existing?.currentExerciseIndex ?? 0) : 0,
            exercises: sortedExercises.map((ex: any, idx: number) => {
                const existingEx = existing?.exercises.find((e: any) => e.exerciseId === ex.id);

                // Get movement-specific reps (movements can override block reps)
                const matchingMovement = ex.programBlock?.movements?.find((m: any) => m.liftId === ex.liftId);
                const targetReps = matchingMovement?.reps ?? ex.programBlock?.reps ?? 5;

                // Build movements list from program block
                const movements = (ex.programBlock?.movements ?? []).map((m: any) => ({
                    movementId: m.id,
                    liftId: m.liftId,
                    liftName: m.lift?.name ?? 'Unknown',
                    displayOrder: m.displayOrder,
                    reps:
                        existingEx?.movements?.find((em: any) => em.movementId === m.id)?.reps ?? m.reps ?? targetReps,
                }));

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
                    movements,
                    blockDisplayOrder: ex.programBlock?.displayOrder ?? idx,
                };
            }),
        };
        syncedCountRef.current = session.exercises.length;
        saveLocalSession(local);
        setLocalSession(local);
    }, [sessionId, sessionExerciseCount]); // eslint-disable-line react-hooks/exhaustive-deps

    // Elapsed time ticker (seconds for M:SS display)
    useEffect(() => {
        const startTime = localSession?.startedAt ?? session?.startedAt;
        if (!startTime) return;
        const start = new Date(startTime).getTime();
        const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [localSession?.startedAt, session?.startedAt]);

    // Redirect if no session (wait for any in-flight refetch to settle first)
    useEffect(() => {
        if (!isLoading && !isFetching && !session) {
            navigate({ to: '/dashboard' });
        }
    }, [isLoading, isFetching, session, navigate]);

    // Format elapsed seconds to M:SS
    const formatTime = useCallback((seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }, []);

    // Current exercise derived state
    const currentIndex = localSession?.currentExerciseIndex ?? 0;
    const currentExercise = localSession?.exercises[currentIndex] ?? null;
    const totalExercises = localSession?.exercises.length ?? 0;
    const isMultiMovement = (currentExercise?.movements.length ?? 0) > 1;

    // Reset active movement index when switching blocks
    useEffect(() => {
        setActiveMovementIndex(0);
    }, [currentIndex]);

    // Get the active movement name for complex blocks
    const activeMovementName = useMemo(() => {
        if (!currentExercise || !isMultiMovement) return undefined;
        const sorted = [...currentExercise.movements].sort((a, b) => a.displayOrder - b.displayOrder);
        return sorted[activeMovementIndex]?.liftName;
    }, [currentExercise, isMultiMovement, activeMovementIndex]);

    const barWeight = settings?.barWeight ?? 20;

    // Target weight for the current exercise (upToPercent of 1RM)
    const targetWeight = useMemo(() => {
        if (!currentExercise?.upToPercent || !currentExercise?.oneRepMax) return null;
        const raw = (currentExercise.oneRepMax * currentExercise.upToPercent) / 100;
        return Math.round(raw);
    }, [currentExercise?.upToPercent, currentExercise?.oneRepMax]);

    // Starting weight for this block: carry-over from previous block or bar weight.
    // Recalculated at the beginning of each block.
    // Only carries over from the same lift category (prevents nonsensical carry across different lifts).
    const blockStartWeight = useMemo(() => {
        if (!localSession || currentIndex === 0) return barWeight;
        const prevExercise = localSession.exercises[currentIndex - 1];
        const prevLastSet = prevExercise?.sets[prevExercise.sets.length - 1];
        if (!prevLastSet) return barWeight;
        // Only carry over from the same lift category (e.g. both "olympic" or both "squat")
        if (currentExercise && prevExercise.liftCategory !== currentExercise.liftCategory) {
            return barWeight;
        }
        const carry = prevLastSet.weight + 2; // minimum 2kg jump between blocks
        // If carry-over exceeds this block's target, start from bar instead
        if (targetWeight && carry >= targetWeight) return barWeight;
        return Math.round(carry);
    }, [localSession, currentIndex, barWeight, targetWeight, currentExercise]);

    // Planned weight for a given progression position (1-indexed).
    // Linear interpolation from blockStartWeight to targetWeight.
    // Position 1 = start, position totalSets = target. Naturally lands on target.
    const getPlannedWeight = useCallback(
        (position: number) => {
            if (!currentExercise) return Math.round(blockStartWeight);

            if (!targetWeight) {
                // No 1RM data available — fall back to 2kg increments per set
                return Math.round(blockStartWeight + (position - 1) * 2);
            }

            if (targetWeight <= blockStartWeight) {
                // Already at or above target — stay at target weight
                return Math.round(targetWeight);
            }

            const totalPositions = Math.max(1, currentExercise.targetSets - 1);
            const progress = Math.min(position - 1, totalPositions) / totalPositions;
            return Math.round(blockStartWeight + (targetWeight - blockStartWeight) * progress);
        },
        [targetWeight, blockStartWeight, currentExercise]
    );

    // Input state
    const [weight, setWeight] = useState(0);
    const [reps, setReps] = useState(5);
    const [feedback, setFeedback] = useState<'hard' | 'normal' | 'easy' | null>(null);

    // Update weight/reps when exercise changes or a set is logged.
    // "Effective position" = number of non-hard sets completed + 1.
    // Hard sets don't advance the progression, so the same weight is suggested again.
    useEffect(() => {
        if (!currentExercise) return;

        const setsLogged = currentExercise.sets.length;
        const lastSet = currentExercise.sets[setsLogged - 1];

        if (lastSet) {
            if (lastSet.feedback === 'hard') {
                // Hard: stay at same weight — lifter may need extra sets to reach target
                setWeight(Math.round(displayWeight(lastSet.weight, unit)));
            } else {
                // Count non-hard sets to determine where we are in the progression
                const effectivePosition = currentExercise.sets.filter((s) => s.feedback !== 'hard').length;
                // Next weight = planned weight for the next progression position
                const nextWeight = getPlannedWeight(effectivePosition + 1);
                setWeight(Math.round(displayWeight(nextWeight, unit)));
            }
            setReps(lastSet.reps);
        } else {
            // First set of this block
            setWeight(Math.round(displayWeight(blockStartWeight, unit)));
            setReps(currentExercise.targetReps);
        }
        setFeedback(null);
    }, [currentIndex, currentExercise?.sets.length, blockStartWeight, unit, getPlannedWeight]); // eslint-disable-line react-hooks/exhaustive-deps

    const currentSetNumber = (currentExercise?.sets.length ?? 0) + 1;
    const targetSets = currentExercise?.targetSets ?? 3;

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

    // Log a set
    const handleLogSet = useCallback(() => {
        if (!currentExercise || weight <= 0) return;

        // For multi-movement blocks, total reps = sum of movement reps
        const totalReps = isMultiMovement ? currentExercise.movements.reduce((sum, m) => sum + m.reps, 0) : reps;

        if (totalReps <= 0) return;

        const updated = addLocalSet(currentIndex, {
            weight: toKg(weight, unit),
            reps: totalReps,
            setType: 'working',
            feedback: feedback ?? undefined,
        });

        if (updated) {
            setLocalSession({ ...updated });
            setViewState('rest');
        }
    }, [currentExercise, currentIndex, weight, reps, feedback, unit, isMultiMovement]);

    // After rest timer completes
    const handleRestDone = useCallback(() => {
        setViewState('exercise');

        if (!localSession) return;
        const ex = localSession.exercises[currentIndex];
        if (!ex) return;

        // Auto-advance to next exercise if all sets done
        if (ex.sets.length >= ex.targetSets && currentIndex < totalExercises - 1) {
            goNext();
        }
    }, [localSession, currentIndex, totalExercises, goNext]);

    // Update movement reps
    const handleMovementRepsChange = useCallback(
        (movementId: string, newReps: number) => {
            const updated = updateMovementReps(currentIndex, movementId, newReps);
            if (updated) setLocalSession({ ...updated });
        },
        [currentIndex]
    );

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
    const setsPerBlock = localSession.exercises.map((ex) => ex.sets.length);
    const targetSetsPerBlock = localSession.exercises.map((ex) => ex.targetSets);
    const isLastBlock = currentIndex >= totalExercises - 1;

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

            {/* Sticky header with progress bar */}
            <SessionHeader
                title={localSession.title ?? 'Training Session'}
                elapsed={formatTime(elapsed)}
                totalSetsLogged={totalSetsLogged}
                currentBlock={currentIndex}
                totalBlocks={totalExercises}
                setsPerBlock={setsPerBlock}
                targetSetsPerBlock={targetSetsPerBlock}
                onBack={() => navigate({ to: '/dashboard' })}
            />

            {/* Rest timer view (replaces block content) */}
            {viewState === 'rest' && currentExercise ? (
                <div className="flex flex-1 flex-col">
                    <RestTimerView
                        completedSet={Math.min(currentSetNumber - 1, targetSets)}
                        totalSets={targetSets}
                        currentBlock={currentIndex}
                        onComplete={handleRestDone}
                    />
                </div>
            ) : currentExercise ? (
                /* Block content + bottom nav */
                <div className="relative flex flex-1 flex-col">
                    <div className="flex flex-1 flex-col pb-6">
                        {/* Video demo placeholder */}
                        <VideoDemo />

                        {/* Exercise info */}
                        <ExerciseInfo exercise={currentExercise} activeMovementName={activeMovementName} />

                        {/* Movement rep counters (multi-movement only) */}
                        {isMultiMovement && (
                            <MovementRepCounters
                                movements={currentExercise.movements}
                                activeMovementIndex={activeMovementIndex}
                                onSelectMovement={setActiveMovementIndex}
                                onUpdateReps={handleMovementRepsChange}
                            />
                        )}

                        {/* Reps & weight controls */}
                        <RepsWeightControls
                            reps={reps}
                            weight={weight}
                            unit={unit}
                            increment={2}
                            hideReps={isMultiMovement}
                            onRepsChange={setReps}
                            onWeightChange={setWeight}
                        />

                        {/* Feedback selector */}
                        <FeedbackSelector value={feedback} onChange={setFeedback} />

                        {/* Set counter + log/finish button */}
                        <SetCounterRow
                            currentSet={currentSetNumber}
                            targetSets={targetSets}
                            isLastBlock={isLastBlock}
                            isFinishing={isFinishing}
                            canLog={weight > 0 && (isMultiMovement || reps > 0)}
                            onLogSet={handleLogSet}
                            onFinish={handleFinish}
                            onUndo={handleUndoLastSet}
                            hasSets={currentExercise.sets.length > 0}
                        />

                        {/* Action links */}
                        <div className="mt-4 divide-y divide-border/40 border-t border-border/40 px-4">
                            {[
                                { icon: FileText, label: 'Movement description' },
                                { icon: History, label: 'View history' },
                            ].map(({ icon: Icon, label }) => (
                                <Button
                                    key={label}
                                    variant="menu"
                                    className="h-auto gap-3 rounded-none px-0 py-3.5 text-sm"
                                >
                                    <Icon className="size-4" />
                                    <span className="flex-1">{label}</span>
                                    <ChevronRight className="size-4 text-muted-foreground/40" />
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Bottom block label */}
                    <BlockNavigation currentBlock={currentIndex} totalBlocks={totalExercises} />
                </div>
            ) : null}
        </div>
    );
}
