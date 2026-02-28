import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RepsWeightControlsProps {
    reps: number;
    weight: number;
    unit: string;
    increment: number;
    /** Hide the reps control (used when multi-movement counters are shown instead) */
    hideReps?: boolean;
    onRepsChange: (reps: number) => void;
    onWeightChange: (weight: number) => void;
}

export function RepsWeightControls({
    reps,
    weight,
    unit,
    increment,
    hideReps,
    onRepsChange,
    onWeightChange,
}: RepsWeightControlsProps) {
    // Always step by at least 1kg
    const step = Math.max(1, Math.round(increment));

    return (
        <div className="mt-6 flex items-stretch justify-center gap-6 px-4">
            {/* Reps stepper */}
            {!hideReps && (
                <>
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onRepsChange(Math.max(1, reps - 1))}
                                className="size-11 shrink-0 rounded-full"
                            >
                                <Minus className="size-4" />
                            </Button>
                            <span className="min-w-8 text-center font-mono text-4xl font-bold tabular-nums text-foreground">
                                {reps}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onRepsChange(reps + 1)}
                                className="size-11 shrink-0 rounded-full"
                            >
                                <Plus className="size-4" />
                            </Button>
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            Reps
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="my-2 w-px bg-border" />
                </>
            )}

            {/* Weight stepper */}
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onWeightChange(Math.max(0, Math.round(weight - step)))}
                        className="size-11 shrink-0 rounded-full"
                    >
                        <Minus className="size-4" />
                    </Button>
                    <span className="min-w-10 text-center font-mono text-4xl font-bold tabular-nums text-foreground">
                        {Math.round(weight)}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onWeightChange(Math.round(weight + step))}
                        className="size-11 shrink-0 rounded-full"
                    >
                        <Plus className="size-4" />
                    </Button>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {unit.toUpperCase()}
                </span>
            </div>
        </div>
    );
}
