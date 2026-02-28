import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SetCounterRowProps {
    currentSet: number;
    targetSets: number;
    isLastBlock: boolean;
    isFinishing: boolean;
    canLog: boolean;
    onLogSet: () => void;
    onFinish: () => void;
    onUndo: () => void;
    hasSets: boolean;
}

export function SetCounterRow({
    currentSet,
    targetSets,
    isLastBlock,
    isFinishing,
    canLog,
    onLogSet,
    onFinish,
    onUndo,
    hasSets,
}: SetCounterRowProps) {
    const isExerciseDone = currentSet > targetSets;
    const showFinish = isExerciseDone && isLastBlock;

    return (
        <div className="mt-6 px-4">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-muted-foreground">
                        Set {Math.min(currentSet, targetSets)}/{targetSets}
                    </span>
                    {hasSets && (
                        <Button
                            variant="link"
                            size="sm"
                            onClick={onUndo}
                            className="h-auto p-0 text-xs text-muted-foreground/60 underline hover:text-muted-foreground"
                        >
                            Undo
                        </Button>
                    )}
                </div>

                {showFinish ? (
                    <Button
                        onClick={onFinish}
                        disabled={isFinishing}
                        className="h-12 flex-1 rounded-xl text-base font-bold"
                    >
                        {isFinishing && <Loader2 className="size-4 animate-spin" />}
                        Finish Workout
                    </Button>
                ) : (
                    <Button
                        onClick={onLogSet}
                        disabled={!canLog}
                        className="h-12 flex-1 rounded-xl text-base font-bold"
                    >
                        {isExerciseDone ? 'Extra Set' : 'Log Set'}
                    </Button>
                )}
            </div>
        </div>
    );
}
