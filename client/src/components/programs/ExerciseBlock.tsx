import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ProgramBlockResponse } from '@liftarchives/shared';

interface ExerciseBlockProps {
    block: ProgramBlockResponse;
}

export function ExerciseBlock({ block }: ExerciseBlockProps) {
    const isComplex = block.movements.length > 1;
    const intensityParts: string[] = [];
    if (block.upTo) {
        if (block.upToPercent) intensityParts.push(`${block.upToPercent}%`);
        if (block.upToRpe) intensityParts.push(`RPE ${block.upToRpe}`);
    }

    const label = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[block.displayOrder - 1] ?? `${block.displayOrder}`;

    return (
        <div
            className={cn(
                'overflow-hidden rounded-xl border',
                isComplex ? 'border-primary/20 bg-secondary/10' : 'border-border/60 bg-secondary/30'
            )}
        >
            {/* Block header */}
            <div
                className={cn(
                    'flex items-center gap-3 px-4 py-2.5',
                    isComplex && 'border-b border-primary/10 bg-primary/[0.03]'
                )}
            >
                <div
                    className={cn(
                        'flex size-7 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold',
                        isComplex ? 'bg-primary/15 text-primary' : 'bg-secondary text-foreground'
                    )}
                >
                    {label}
                </div>

                <span className="font-mono text-sm font-semibold text-foreground">
                    {block.sets}x{block.reps > 1 ? block.reps : ''}
                </span>

                {isComplex && (
                    <Badge className="border-0 bg-primary/15 text-[9px] font-bold uppercase tracking-widest text-primary">
                        Complex
                    </Badge>
                )}

                {intensityParts.length > 0 && (
                    <>
                        <div className="h-3.5 w-px bg-border" />
                        <span className="text-xs text-primary">
                            {'up to '}
                            <span className="font-mono font-semibold">{intensityParts.join(' / ')}</span>
                        </span>
                    </>
                )}

                {block.notes && (
                    <>
                        <div className="h-3.5 w-px bg-border" />
                        <span className="text-xs text-muted-foreground italic">{block.notes}</span>
                    </>
                )}
            </div>

            {/* Movements */}
            {isComplex ? (
                <div className="relative px-4 py-2.5">
                    {/* Vertical connector */}
                    {block.movements.length > 1 && (
                        <div className="absolute bottom-5 left-[1.65rem] top-5 w-px bg-primary/20" />
                    )}
                    <div className="space-y-0">
                        {block.movements.map((m) => (
                            <div key={m.id} className="group relative flex items-center gap-3 py-1.5">
                                <div className="relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-card">
                                    <div className="size-1.5 rounded-full bg-primary/50" />
                                </div>
                                <span className="flex-1 text-sm font-medium text-foreground">{m.lift.name}</span>
                                <span className="shrink-0 font-mono text-sm text-muted-foreground">
                                    {m.reps} <span className="text-xs">rep{m.reps !== 1 ? 's' : ''}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="px-4 py-2.5">
                    {block.movements.map((m) => (
                        <div key={m.id} className="flex items-center gap-3">
                            <span className="flex-1 text-sm font-semibold text-foreground">{m.lift.name}</span>
                            <span className="font-mono text-sm text-muted-foreground">
                                {m.reps} <span className="text-xs">rep{m.reps !== 1 ? 's' : ''}</span>
                            </span>
                        </div>
                    ))}
                    {block.movements.length === 0 && <p className="text-sm text-muted-foreground/60">No movements</p>}
                </div>
            )}
        </div>
    );
}
