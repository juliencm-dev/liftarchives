import type { LocalExerciseData } from '@/lib/session-store';
import { useIntensityMode } from '@/hooks/use-training-settings';

interface ExerciseInfoProps {
    exercise: LocalExerciseData;
    /** For complex blocks, the name of the currently active movement */
    activeMovementName?: string;
}

export function ExerciseInfo({ exercise, activeMovementName }: ExerciseInfoProps) {
    const intensityMode = useIntensityMode();
    const { liftName, targetSets, targetReps, upToPercent, upToRpe, movements } = exercise;
    const isComplex = movements.length > 1;

    // Build the reps display string
    let repsDisplay: string;
    if (isComplex) {
        const repsNotation = movements
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((m) => m.reps)
            .join('+');
        repsDisplay = `${targetSets}x (${repsNotation})`;
    } else {
        repsDisplay = `${targetSets}x${targetReps}`;
    }

    // Build the intensity string — prioritize the active mode, fall back to the other
    let intensityLabel: string | null = null;
    if (intensityMode === 'percent') {
        if (upToPercent) intensityLabel = `up to ${upToPercent}%`;
        else if (upToRpe) intensityLabel = `up to RPE ${upToRpe}`;
    } else {
        if (upToRpe) intensityLabel = `up to RPE ${upToRpe}`;
        else if (upToPercent) intensityLabel = `up to ${upToPercent}%`;
    }

    // For complex blocks, show the active movement name; otherwise the lift name
    const displayName = isComplex && activeMovementName ? activeMovementName : liftName;

    return (
        <div className="mt-5 px-4 text-center">
            <h2 className="text-xl font-bold text-foreground">{displayName}</h2>
            <div className="mt-1 flex items-center justify-center gap-2">
                <span className="font-mono text-sm text-muted-foreground">{repsDisplay}</span>
                {intensityLabel && (
                    <>
                        <div className="h-3 w-px bg-border" />
                        <span className="text-xs text-primary">{intensityLabel}</span>
                    </>
                )}
            </div>
        </div>
    );
}
