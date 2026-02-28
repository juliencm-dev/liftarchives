import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { LocalMovement } from '@/lib/session-store';

interface MovementRepCountersProps {
    movements: LocalMovement[];
    activeMovementIndex: number;
    onSelectMovement: (index: number) => void;
    onUpdateReps: (movementId: string, reps: number) => void;
}

export function MovementRepCounters({
    movements,
    activeMovementIndex,
    onSelectMovement,
    onUpdateReps,
}: MovementRepCountersProps) {
    const sorted = [...movements].sort((a, b) => a.displayOrder - b.displayOrder);

    return (
        <div className="mx-4 mt-5 rounded-xl border border-border/50 bg-secondary/30">
            {sorted.map((m, i) => (
                <div
                    key={m.movementId}
                    className={cn(
                        'flex items-center gap-3 px-4 py-3 transition-colors',
                        i < sorted.length - 1 && 'border-b border-border/30',
                        i === activeMovementIndex && 'bg-primary/[0.04]'
                    )}
                >
                    {/* Connector dot */}
                    <div
                        className={cn(
                            'size-2 shrink-0 rounded-full transition-colors',
                            i === activeMovementIndex ? 'bg-primary' : 'bg-muted-foreground/20'
                        )}
                    />
                    <Button
                        variant="ghost"
                        onClick={() => onSelectMovement(i)}
                        className={cn(
                            'h-auto flex-1 justify-start p-0 text-sm hover:bg-transparent',
                            i === activeMovementIndex
                                ? 'font-semibold text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        {m.liftName}
                    </Button>

                    {/* Inline reps stepper */}
                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="outline"
                            size="icon-xs"
                            onClick={() => onUpdateReps(m.movementId, m.reps - 1)}
                            className="rounded-full border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                        >
                            <Minus className="size-3" />
                        </Button>
                        <span className="w-6 text-center font-mono text-sm font-bold text-foreground">{m.reps}</span>
                        <Button
                            variant="outline"
                            size="icon-xs"
                            onClick={() => onUpdateReps(m.movementId, m.reps + 1)}
                            className="rounded-full border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                        >
                            <Plus className="size-3" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
