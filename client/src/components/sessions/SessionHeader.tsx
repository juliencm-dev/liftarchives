import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SessionHeaderProps {
    title: string;
    elapsed: string;
    totalSetsLogged: number;
    currentBlock: number;
    totalBlocks: number;
    setsPerBlock: number[];
    targetSetsPerBlock: number[];
    onBack: () => void;
}

export function SessionHeader({
    title,
    elapsed,
    totalSetsLogged,
    currentBlock,
    totalBlocks,
    setsPerBlock,
    targetSetsPerBlock,
    onBack,
}: SessionHeaderProps) {
    return (
        <header className="sticky top-0 z-20 border-b border-border/50 bg-background/95 backdrop-blur-md">
            <div className="relative flex items-center px-4 py-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="relative z-10 size-9 text-muted-foreground"
                >
                    <ArrowLeft className="size-5" />
                </Button>

                {/* Absolutely centered title + stats */}
                <div className="absolute inset-x-0 flex flex-col items-center pointer-events-none">
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-[11px] tabular-nums text-muted-foreground">
                        {elapsed} &middot; {totalSetsLogged} sets
                    </p>
                </div>
            </div>

            {/* Block progress bar */}
            <div className="flex gap-1 px-4 pb-2.5">
                {Array.from({ length: totalBlocks }).map((_, i) => {
                    const done = setsPerBlock[i] >= targetSetsPerBlock[i];
                    return (
                        <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                                done ? 'bg-primary' : i === currentBlock ? 'bg-primary/50' : 'bg-secondary'
                            }`}
                        />
                    );
                })}
            </div>
        </header>
    );
}
