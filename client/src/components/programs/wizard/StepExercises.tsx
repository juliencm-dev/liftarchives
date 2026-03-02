import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Plus,
    ChevronDown,
    ChevronUp,
    Trash2,
    X,
    Copy,
    GripVertical,
    AlertTriangle,
    EllipsisVertical,
    StickyNote,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIntensityMode } from '@/hooks/use-training-settings';
import { ExercisePicker } from './ExercisePicker';
import type { WizardDay, ProgramBlock, BlockMovement, WeekBlocks } from './ProgramWizard';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface StepExercisesProps {
    days: WizardDay[];
    weekBlocks: WeekBlocks[];
    onWeekBlocksChange: (weekBlocks: WeekBlocks[]) => void;
}

function createMovement(liftId: string, name: string): BlockMovement {
    return { id: crypto.randomUUID(), liftId, name, reps: '1' };
}

function createBlock(label: string): ProgramBlock {
    return {
        id: crypto.randomUUID(),
        label,
        sets: '3',
        reps: '1',
        movements: [],
        upTo: false,
        upToPercent: '',
        upToRpe: '',
        setDetails: [],
        notes: '',
        warning: '',
    };
}

function getNextLabel(blocks: ProgramBlock[]): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet[blocks.length] ?? `${blocks.length + 1}`;
}

function relabelBlocks(blocks: ProgramBlock[]): ProgramBlock[] {
    return blocks.map((b, i) => ({
        ...b,
        label: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i] ?? `${i + 1}`,
    }));
}

// --- Sortable block wrapper ---
function SortableBlock({
    block,
    children,
}: {
    block: ProgramBlock;
    children: (listeners: ReturnType<typeof useSortable>['listeners']) => React.ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            {children(listeners)}
        </div>
    );
}

export function StepExercises({ days, weekBlocks, onWeekBlocksChange }: StepExercisesProps) {
    const intensityMode = useIntensityMode();
    const [activeWeek, setActiveWeek] = useState(1);
    const [activeDay, setActiveDay] = useState(days[0]?.id ?? '');
    const [pickerForBlock, setPickerForBlock] = useState<string | null>(null);
    const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(new Set());
    const [showNotesFor, setShowNotesFor] = useState<Set<string>>(new Set());
    const [showSetDetailsFor, setShowSetDetailsFor] = useState<Set<string>>(new Set());

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const currentWeekBlock = weekBlocks.find((wb) => wb.weekNumber === activeWeek);
    const currentDayBlock = currentWeekBlock?.dayBlocks.find((d) => d.dayId === activeDay) ?? {
        dayId: activeDay,
        blocks: [],
    };
    const currentBlocks = currentDayBlock.blocks;

    function updateDay(blocks: ProgramBlock[]) {
        onWeekBlocksChange(
            weekBlocks.map((wb) => {
                if (wb.weekNumber !== activeWeek) return wb;
                const existing = wb.dayBlocks.find((d) => d.dayId === activeDay);
                if (existing) {
                    return {
                        ...wb,
                        dayBlocks: wb.dayBlocks.map((d) => (d.dayId === activeDay ? { ...d, blocks } : d)),
                    };
                }
                return {
                    ...wb,
                    dayBlocks: [...wb.dayBlocks, { dayId: activeDay, blocks }],
                };
            })
        );
    }

    function addBlock() {
        const label = getNextLabel(currentBlocks);
        const newBlock = createBlock(label);
        updateDay([...currentBlocks, newBlock]);
        setPickerForBlock(newBlock.id);
    }

    function removeBlock(blockId: string) {
        updateDay(relabelBlocks(currentBlocks.filter((b) => b.id !== blockId)));
    }

    function updateBlock(blockId: string, updates: Partial<ProgramBlock>) {
        updateDay(currentBlocks.map((b) => (b.id === blockId ? { ...b, ...updates } : b)));
    }

    function addMovementToBlock(blockId: string, liftId: string, name: string) {
        const block = currentBlocks.find((b) => b.id === blockId);
        if (!block) return;
        updateBlock(blockId, {
            movements: [...block.movements, createMovement(liftId, name)],
        });
    }

    function removeMovement(blockId: string, movementId: string) {
        const block = currentBlocks.find((b) => b.id === blockId);
        if (!block) return;
        updateBlock(blockId, {
            movements: block.movements.filter((m) => m.id !== movementId),
        });
    }

    function updateMovement(blockId: string, movementId: string, field: keyof BlockMovement, value: string) {
        const block = currentBlocks.find((b) => b.id === blockId);
        if (!block) return;
        updateBlock(blockId, {
            movements: block.movements.map((m) => (m.id === movementId ? { ...m, [field]: value } : m)),
        });
    }

    function toggleCollapse(blockId: string) {
        setCollapsedBlocks((prev) => {
            const next = new Set(prev);
            if (next.has(blockId)) next.delete(blockId);
            else next.add(blockId);
            return next;
        });
    }

    function toggleNotes(blockId: string) {
        setShowNotesFor((prev) => {
            const next = new Set(prev);
            if (next.has(blockId)) next.delete(blockId);
            else next.add(blockId);
            return next;
        });
    }

    function toggleSetDetails(blockId: string) {
        const block = currentBlocks.find((b) => b.id === blockId);
        if (!block) return;

        setShowSetDetailsFor((prev) => {
            const next = new Set(prev);
            if (next.has(blockId)) {
                next.delete(blockId);
                // Clear setDetails when toggling off
                updateBlock(blockId, { setDetails: [] });
            } else {
                next.add(blockId);
                // Initialize setDetails rows to match sets count
                const setsCount = parseInt(block.sets) || 1;
                if (block.setDetails.length === 0) {
                    updateBlock(blockId, {
                        setDetails: Array.from({ length: setsCount }, () => ({ percent: '', rpe: '' })),
                    });
                }
            }
            return next;
        });
    }

    function handleSetsChange(blockId: string, newSetsValue: string) {
        const block = currentBlocks.find((b) => b.id === blockId);
        if (!block) return;

        const isExpanded = showSetDetailsFor.has(blockId);
        const newCount = parseInt(newSetsValue) || 0;

        if (isExpanded && newCount > 0) {
            // Resize setDetails to match new sets count
            const current = block.setDetails;
            let updated: { percent: string; rpe: string }[];
            if (newCount > current.length) {
                updated = [
                    ...current,
                    ...Array.from({ length: newCount - current.length }, () => ({ percent: '', rpe: '' })),
                ];
            } else {
                updated = current.slice(0, newCount);
            }
            updateBlock(blockId, { sets: newSetsValue, setDetails: updated });
        } else {
            updateBlock(blockId, { sets: newSetsValue });
        }
    }

    function updateSetDetail(blockId: string, setIndex: number, field: 'percent' | 'rpe', value: string) {
        const block = currentBlocks.find((b) => b.id === blockId);
        if (!block) return;
        const updated = block.setDetails.map((sd, i) => (i === setIndex ? { ...sd, [field]: value } : sd));
        updateBlock(blockId, { setDetails: updated });
    }

    function copyFromWeek(sourceWeekNumber: number) {
        const sourceWeek = weekBlocks.find((wb) => wb.weekNumber === sourceWeekNumber);
        if (!sourceWeek) return;

        // Deep clone blocks with new UUIDs for all days
        const clonedDayBlocks = sourceWeek.dayBlocks.map((db) => ({
            dayId: db.dayId,
            blocks: db.blocks.map((b, i) => ({
                ...b,
                id: crypto.randomUUID(),
                label: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i] ?? `${i + 1}`,
                movements: b.movements.map((m) => ({ ...m, id: crypto.randomUUID() })),
            })),
        }));

        onWeekBlocksChange(
            weekBlocks.map((wb) => (wb.weekNumber === activeWeek ? { ...wb, dayBlocks: clonedDayBlocks } : wb))
        );
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = currentBlocks.findIndex((b) => b.id === active.id);
        const newIndex = currentBlocks.findIndex((b) => b.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        updateDay(relabelBlocks(arrayMove(currentBlocks, oldIndex, newIndex)));
    }

    return (
        <div className="mx-auto w-full max-w-2xl space-y-3">
            {/* Sticky week + day selector */}
            <div className="sticky top-[152px] z-10 -mx-4 shrink-0 space-y-2 bg-background px-4 pb-2 lg:-mx-6 lg:px-6">
                {/* Week tabs (only when multiple weeks) */}
                {weekBlocks.length > 1 && (
                    <div className="flex items-center gap-2">
                        <Tabs value={String(activeWeek)} onValueChange={(v) => setActiveWeek(Number(v))}>
                            <TabsList className="h-auto justify-start gap-0 overflow-x-auto rounded-xl border border-border bg-secondary p-1">
                                {weekBlocks.map((wb) => (
                                    <TabsTrigger
                                        key={wb.weekNumber}
                                        value={String(wb.weekNumber)}
                                        className="rounded-lg px-3 py-1.5 text-sm data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                    >
                                        Week {wb.weekNumber}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>

                        {/* Copy from week dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                                    <Copy className="size-3" />
                                    Copy from
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-32 border-border bg-popover">
                                {weekBlocks
                                    .filter((wb) => wb.weekNumber !== activeWeek)
                                    .map((wb) => (
                                        <DropdownMenuItem
                                            key={wb.weekNumber}
                                            onClick={() => copyFromWeek(wb.weekNumber)}
                                            className="text-foreground"
                                        >
                                            Week {wb.weekNumber}
                                        </DropdownMenuItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}

                {/* Day tabs */}
                <Tabs value={activeDay} onValueChange={setActiveDay}>
                    <TabsList className="h-auto w-full justify-start gap-0 overflow-x-auto rounded-xl border border-border bg-secondary p-1">
                        {days.map((day) => {
                            const dayEx = currentWeekBlock?.dayBlocks.find((d) => d.dayId === day.id);
                            const count = dayEx?.blocks.length ?? 0;
                            return (
                                <TabsTrigger
                                    key={day.id}
                                    value={day.id}
                                    className="gap-2 rounded-lg px-4 py-2 text-sm data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm w-full"
                                >
                                    {day.name}
                                    {count > 0 && (
                                        <span className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                                            {count}
                                        </span>
                                    )}
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                </Tabs>
            </div>

            {/* Block list with drag-and-drop */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={currentBlocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                        {currentBlocks.map((block) => {
                            const isCollapsed = collapsedBlocks.has(block.id);
                            const showNotes = showNotesFor.has(block.id) || block.notes.length > 0;
                            const showSetDetails = showSetDetailsFor.has(block.id) || block.setDetails.length > 0;

                            return (
                                <SortableBlock key={block.id} block={block}>
                                    {(listeners) => (
                                        <div
                                            className={cn(
                                                'overflow-hidden rounded-xl border',
                                                block.warning
                                                    ? 'border-destructive/40'
                                                    : block.movements.length > 1
                                                      ? 'border-primary/20 bg-secondary/10'
                                                      : 'border-border/60 bg-secondary/30'
                                            )}
                                        >
                                            {/* Block header */}
                                            <div
                                                className={cn(
                                                    'flex items-center gap-2 px-3 py-2.5',
                                                    block.movements.length > 1 &&
                                                        'border-b border-primary/10 bg-primary/[0.03]'
                                                )}
                                            >
                                                {/* Drag handle */}
                                                <button
                                                    type="button"
                                                    {...listeners}
                                                    className="flex shrink-0 cursor-grab items-center justify-center text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
                                                    tabIndex={-1}
                                                >
                                                    <GripVertical className="size-3.5" />
                                                </button>

                                                {/* Letter badge */}
                                                <div
                                                    className={cn(
                                                        'flex size-7 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold',
                                                        block.movements.length > 1
                                                            ? 'bg-primary/15 text-primary'
                                                            : 'bg-secondary text-foreground'
                                                    )}
                                                >
                                                    {block.label}
                                                </div>

                                                {/* Sets x Reps input */}
                                                <div className="flex items-center gap-1">
                                                    <Input
                                                        value={block.sets}
                                                        onChange={(e) => handleSetsChange(block.id, e.target.value)}
                                                        className="h-7 w-10 border-border bg-input px-0 text-center font-mono text-sm font-semibold text-foreground"
                                                    />
                                                    <span className="text-xs font-medium text-muted-foreground">x</span>
                                                    <Input
                                                        value={block.reps}
                                                        onChange={(e) =>
                                                            updateBlock(block.id, { reps: e.target.value })
                                                        }
                                                        className="h-7 w-10 border-border bg-input px-0 text-center font-mono text-sm font-semibold text-foreground"
                                                    />
                                                </div>

                                                {/* Spacer */}
                                                <span className="flex-1" />

                                                {/* Up to toggle */}
                                                <label
                                                    className="flex cursor-pointer items-center gap-1.5"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Checkbox
                                                        checked={block.upTo}
                                                        onCheckedChange={(checked) =>
                                                            updateBlock(block.id, { upTo: !!checked })
                                                        }
                                                        className="size-3.5 border-muted-foreground/40 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                                                    />
                                                    <span className="text-[11px] font-medium text-muted-foreground">
                                                        Up to
                                                    </span>
                                                </label>

                                                {/* Intensity inputs when upTo is on */}
                                                {block.upTo && (
                                                    <div className="flex items-center gap-1">
                                                        {intensityMode === 'percent' ? (
                                                            <Input
                                                                value={block.upToPercent}
                                                                onChange={(e) =>
                                                                    updateBlock(block.id, {
                                                                        upToPercent: e.target.value,
                                                                    })
                                                                }
                                                                placeholder="%"
                                                                className="h-6 w-12 border-border bg-input px-1 text-center text-[11px] font-mono text-foreground"
                                                            />
                                                        ) : (
                                                            <Input
                                                                value={block.upToRpe}
                                                                onChange={(e) =>
                                                                    updateBlock(block.id, { upToRpe: e.target.value })
                                                                }
                                                                placeholder="RPE"
                                                                className="h-6 w-12 border-border bg-input px-1 text-center text-[11px] font-mono text-foreground"
                                                            />
                                                        )}
                                                    </div>
                                                )}

                                                {/* Collapse toggle */}
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => toggleCollapse(block.id)}
                                                    className="size-7"
                                                >
                                                    {isCollapsed ? (
                                                        <ChevronDown className="size-3.5" />
                                                    ) : (
                                                        <ChevronUp className="size-3.5" />
                                                    )}
                                                </Button>

                                                {/* Overflow menu */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-7"
                                                        >
                                                            <EllipsisVertical className="size-3.5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-40 border-border bg-popover"
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={() => toggleNotes(block.id)}
                                                            className="gap-2 text-foreground"
                                                        >
                                                            <StickyNote className="size-3.5" />
                                                            {showNotes ? 'Hide notes' : 'Add notes'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => removeBlock(block.id)}
                                                            className="gap-2 text-destructive"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                            Delete block
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            {/* Warning banner */}
                                            {block.warning && (
                                                <div className="flex items-center gap-2 border-t border-destructive/20 bg-destructive/5 px-3 py-1.5">
                                                    <AlertTriangle className="size-3.5 shrink-0 text-destructive" />
                                                    <span className="flex-1 text-xs text-destructive">
                                                        {block.warning}
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => updateBlock(block.id, { warning: '' })}
                                                        className="size-5 text-destructive/60 hover:text-destructive"
                                                    >
                                                        <X className="size-3" />
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Movement list */}
                                            {!isCollapsed && (
                                                <div className="border-t border-border/50">
                                                    {block.movements.length === 0 ? (
                                                        <div className="px-4 py-5 text-center">
                                                            <p className="text-sm text-muted-foreground/60">
                                                                Add movements to this block
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            {block.movements.map((movement, i) => (
                                                                <div
                                                                    key={movement.id}
                                                                    className={cn(
                                                                        'group flex items-center gap-2 px-3 py-2',
                                                                        i > 0 && 'border-t border-border/30'
                                                                    )}
                                                                >
                                                                    {/* Reps input */}
                                                                    <Input
                                                                        value={movement.reps}
                                                                        onChange={(e) =>
                                                                            updateMovement(
                                                                                block.id,
                                                                                movement.id,
                                                                                'reps',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="h-7 w-10 shrink-0 border-border bg-input px-0 text-center font-mono text-sm font-semibold text-foreground"
                                                                    />

                                                                    {/* Movement name */}
                                                                    <span className="flex-1 text-sm font-medium text-foreground">
                                                                        {movement.name}
                                                                    </span>

                                                                    {/* Per-set details toggle — only on first movement */}
                                                                    {i === 0 && (
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => toggleSetDetails(block.id)}
                                                                            className={cn(
                                                                                'size-6',
                                                                                showSetDetails
                                                                                    ? 'text-primary'
                                                                                    : 'text-muted-foreground/40'
                                                                            )}
                                                                        >
                                                                            {showSetDetails ? (
                                                                                <ChevronUp className="size-3.5" />
                                                                            ) : (
                                                                                <ChevronDown className="size-3.5" />
                                                                            )}
                                                                        </Button>
                                                                    )}

                                                                    {/* Remove movement */}
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() =>
                                                                            removeMovement(block.id, movement.id)
                                                                        }
                                                                        className="size-6 text-muted-foreground/0 group-hover:text-destructive/60 hover:text-destructive"
                                                                    >
                                                                        <X className="size-3" />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Per-set details rows */}
                                            {showSetDetails && !isCollapsed && block.setDetails.length > 0 && (
                                                <div className="border-t border-border/50 px-3 py-2">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
                                                            <span className="w-10 text-center">Set</span>
                                                            <span className="w-16 text-center">
                                                                {intensityMode === 'percent' ? '%' : 'RPE'}
                                                            </span>
                                                        </div>
                                                        {block.setDetails.map((sd, i) => (
                                                            <div key={i} className="flex items-center gap-2">
                                                                <span className="w-10 text-center font-mono text-xs text-muted-foreground">
                                                                    {i + 1}
                                                                </span>
                                                                {intensityMode === 'percent' ? (
                                                                    <Input
                                                                        value={sd.percent}
                                                                        onChange={(e) =>
                                                                            updateSetDetail(
                                                                                block.id,
                                                                                i,
                                                                                'percent',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        placeholder="%"
                                                                        className="h-6 w-16 border-border bg-input px-1 text-center text-[11px] font-mono text-foreground"
                                                                    />
                                                                ) : (
                                                                    <Input
                                                                        value={sd.rpe}
                                                                        onChange={(e) =>
                                                                            updateSetDetail(
                                                                                block.id,
                                                                                i,
                                                                                'rpe',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        placeholder="RPE"
                                                                        className="h-6 w-16 border-border bg-input px-1 text-center text-[11px] font-mono text-foreground"
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Notes row (optional) */}
                                            {showNotes && !isCollapsed && (
                                                <div className="border-t border-border/50 px-3 py-2">
                                                    <Textarea
                                                        value={block.notes}
                                                        onChange={(e) =>
                                                            updateBlock(block.id, { notes: e.target.value })
                                                        }
                                                        placeholder="Notes: Every 90sec, From box, EMOM 15min..."
                                                        rows={1}
                                                        className="min-h-8 resize-none border-0 bg-transparent p-0 text-xs text-muted-foreground placeholder:text-muted-foreground/40 focus-visible:ring-0"
                                                    />
                                                </div>
                                            )}

                                            {/* Add movement — always at the bottom */}
                                            {!isCollapsed && (
                                                <div className="border-t border-border/30 px-3 py-1.5">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setPickerForBlock(block.id)}
                                                        className="h-7 w-full gap-1.5 text-xs hover:text-primary"
                                                    >
                                                        <Plus className="size-3" />
                                                        Add Movement
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </SortableBlock>
                            );
                        })}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Add block button */}
            <Button type="button" variant="outline" onClick={addBlock} className="h-12 w-full gap-2 border-dashed">
                <Plus className="size-4" />
                Add Block
                {currentBlocks.length > 0 && <span className="font-mono">({getNextLabel(currentBlocks)})</span>}
            </Button>

            {/* Exercise picker dialog — stays open for adding multiple movements */}
            <ExercisePicker
                open={!!pickerForBlock}
                onClose={() => setPickerForBlock(null)}
                stayOpen
                onSelect={(liftId, liftName) => {
                    if (pickerForBlock) {
                        addMovementToBlock(pickerForBlock, liftId, liftName);
                    }
                }}
            />
        </div>
    );
}
