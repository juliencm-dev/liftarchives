import { Badge } from '@/components/ui/badge';
import { CollapsibleCard } from '@/components/ui/collapsible-card';
import { Dumbbell } from 'lucide-react';
import { ExerciseBlock } from './ExerciseBlock';
import type { ProgramDayResponse } from '@liftarchives/shared';

interface ProgramDayCardProps {
    day: ProgramDayResponse;
    defaultOpen?: boolean;
}

export function ProgramDayCard({ day, defaultOpen = true }: ProgramDayCardProps) {
    const blocks = day.blocks ?? [];

    const title = (
        <span className="flex items-center gap-3">
            {day.name || `Day ${day.dayNumber}`}
            {blocks.length > 0 && (
                <Badge variant="secondary" className="border-0 bg-primary/10 text-[10px] font-bold text-primary">
                    {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'}
                </Badge>
            )}
        </span>
    );

    return (
        <CollapsibleCard icon={<Dumbbell className="size-4 text-primary" />} title={title} defaultOpen={defaultOpen}>
            {blocks.length === 0 ? (
                <p className="py-2 text-sm text-muted-foreground">No exercises for this day.</p>
            ) : (
                <div className="space-y-3">
                    {blocks.map((block) => (
                        <ExerciseBlock key={block.id} block={block} />
                    ))}
                </div>
            )}
        </CollapsibleCard>
    );
}
