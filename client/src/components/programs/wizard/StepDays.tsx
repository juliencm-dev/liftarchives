import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WizardDay, DayBlocks } from './ProgramWizard';

interface StepDaysProps {
    days: WizardDay[];
    onDaysChange: (days: WizardDay[]) => void;
    dayBlocks: DayBlocks[];
    onDayBlocksChange: (dayBlocks: DayBlocks[]) => void;
}

function DayRow({
    day,
    index,
    onNameChange,
    onDuplicate,
    onRemove,
    canDelete,
}: {
    day: WizardDay;
    index: number;
    onNameChange: (name: string) => void;
    onDuplicate: () => void;
    onRemove: () => void;
    canDelete: boolean;
}) {
    return (
        <div className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/20">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary">
                {index + 1}
            </div>

            <Input
                value={day.name}
                onChange={(e) => onNameChange(e.target.value)}
                className="h-10 flex-1 border-border bg-input text-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
                placeholder="Day name"
            />

            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onDuplicate}
                    className="size-9 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label={`Duplicate ${day.name}`}
                >
                    <Copy className="size-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onRemove}
                    disabled={!canDelete}
                    className={cn(
                        'size-9 transition-opacity',
                        !canDelete
                            ? 'text-muted-foreground/30'
                            : 'text-destructive opacity-0 hover:text-destructive group-hover:opacity-100'
                    )}
                    aria-label={`Remove ${day.name}`}
                >
                    <Trash2 className="size-4" />
                </Button>
            </div>
        </div>
    );
}

export function StepDays({ days, onDaysChange, dayBlocks, onDayBlocksChange }: StepDaysProps) {
    const addDay = () => {
        const newId = crypto.randomUUID();
        const newDay: WizardDay = {
            id: newId,
            name: `Day ${days.length + 1}`,
        };
        onDaysChange([...days, newDay]);
        onDayBlocksChange([...dayBlocks, { dayId: newId, blocks: [] }]);
    };

    const removeDay = (dayId: string) => {
        if (days.length <= 1) return;
        onDaysChange(days.filter((d) => d.id !== dayId));
        onDayBlocksChange(dayBlocks.filter((db) => db.dayId !== dayId));
    };

    const duplicateDay = (dayId: string) => {
        const source = days.find((d) => d.id === dayId);
        if (!source) return;

        const newDayId = crypto.randomUUID();
        const newDay: WizardDay = {
            id: newDayId,
            name: `${source.name} (copy)`,
        };
        onDaysChange([...days, newDay]);

        // Duplicate blocks for this day
        const sourceDayBlocks = dayBlocks.find((db) => db.dayId === dayId);
        if (sourceDayBlocks) {
            const newBlocks = sourceDayBlocks.blocks.map((b) => ({
                ...b,
                id: crypto.randomUUID(),
                movements: b.movements.map((m) => ({ ...m, id: crypto.randomUUID() })),
            }));
            onDayBlocksChange([...dayBlocks, { dayId: newDayId, blocks: newBlocks }]);
        } else {
            onDayBlocksChange([...dayBlocks, { dayId: newDayId, blocks: [] }]);
        }
    };

    const updateDayName = (dayId: string, name: string) => {
        onDaysChange(days.map((d) => (d.id === dayId ? { ...d, name } : d)));
    };

    return (
        <div className="mx-auto w-full max-w-xl space-y-3">
            {days.map((day, index) => (
                <DayRow
                    key={day.id}
                    day={day}
                    index={index}
                    onNameChange={(name) => updateDayName(day.id, name)}
                    onDuplicate={() => duplicateDay(day.id)}
                    onRemove={() => removeDay(day.id)}
                    canDelete={days.length > 1}
                />
            ))}

            <Button type="button" variant="outline" onClick={addDay} className="h-12 w-full gap-2 border-dashed">
                <Plus className="size-4" />
                Add Day
            </Button>
        </div>
    );
}
