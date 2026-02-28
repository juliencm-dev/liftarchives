const BLOCK_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

interface BlockNavigationProps {
    currentBlock: number;
    totalBlocks: number;
}

export function BlockNavigation({ currentBlock, totalBlocks }: BlockNavigationProps) {
    const letter = BLOCK_LETTERS[currentBlock] ?? `${currentBlock + 1}`;

    return (
        <div className="sticky bottom-0 flex items-center justify-center gap-2 border-t border-border/40 bg-background/95 px-4 py-3 backdrop-blur-sm">
            <span className="rounded-md bg-primary/15 px-2 py-0.5 font-mono text-xs font-bold text-primary">
                {letter}
            </span>
            <span className="text-xs text-muted-foreground">
                Block {currentBlock + 1} of {totalBlocks}
            </span>
        </div>
    );
}
