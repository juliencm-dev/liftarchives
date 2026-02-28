import { useState } from 'react';
import { ArrowLeft, Percent, Plus, TrendingUp, Trophy, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { useAddPersonalRecord } from '@/hooks/use-lifts';
import { toast } from 'sonner';
import { generatePercentageTable } from '@/lib/calculator';

interface LiftRecord {
    date: string;
    weight: number;
    reps: number;
    estimatedOneRepMax: number | null;
}

interface LiftCardProps {
    lift: {
        id: string;
        name: string;
        category: string;
    };
    records: LiftRecord[];
    isSelected: boolean;
    onSelect: () => void;
}

const categoryColors: Record<string, string> = {
    olympic: 'bg-primary/15 text-primary border-primary/20',
    powerlifting: 'bg-red-500/15 text-red-400 border-red-500/20',
    accessory: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
};

const categoryLabels: Record<string, string> = {
    olympic: 'Olympic',
    powerlifting: 'Powerlifting',
    accessory: 'Accessory',
};

function LiftCardAddForm({
    newWeight,
    newDate,
    isPending,
    onWeightChange,
    onDateChange,
    onSubmit,
    onCancel,
}: {
    newWeight: string;
    newDate: string;
    isPending: boolean;
    onWeightChange: (value: string) => void;
    onDateChange: (value: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    step="0.5"
                    placeholder="Weight"
                    value={newWeight}
                    onChange={(e) => onWeightChange(e.target.value)}
                    className="h-8 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') onSubmit();
                        if (e.key === 'Escape') onCancel();
                    }}
                />
                <span className="text-xs text-muted-foreground">kg</span>
            </div>
            <DatePicker value={newDate} onChange={(v) => onDateChange(v)} className="h-8 text-sm" />
            <div className="flex items-center gap-1.5">
                <Button size="sm" className="h-7 flex-1 text-xs" onClick={onSubmit} disabled={isPending}>
                    <Check className="size-3" />
                    {isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onCancel}>
                    <X className="size-3" />
                </Button>
            </div>
        </div>
    );
}

function LiftCardPRDisplay({
    currentPR,
    improvement,
}: {
    currentPR: { weight: number; date: string } | null;
    improvement: number | null;
}) {
    if (!currentPR) {
        return (
            <div className="flex items-center gap-2 py-2">
                <Trophy className="size-4 text-muted-foreground/50" />
                <span className="text-xs text-muted-foreground">No records yet</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tabular-nums text-foreground">{currentPR.weight}</span>
                <span className="text-xs font-medium text-muted-foreground">kg</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{currentPR.date}</span>
                {improvement !== null && improvement > 0 && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-400">
                        <TrendingUp className="size-3" />+{improvement}kg
                    </span>
                )}
            </div>
        </div>
    );
}

function LiftCardPercentageTable({ max, onBack }: { max: number; onBack: () => void }) {
    const rows = generatePercentageTable(max, 'kg');
    return (
        <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">% of {max}kg</span>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    className="size-6 text-muted-foreground"
                    onClick={onBack}
                    aria-label="Back to PR view"
                >
                    <ArrowLeft className="size-3.5" />
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs">
                {rows.map((row) => (
                    <div
                        key={row.percent}
                        className="flex items-center justify-between rounded px-1.5 py-0.5 odd:bg-secondary/40"
                    >
                        <span className="tabular-nums text-muted-foreground">{row.percent}%</span>
                        <span className="tabular-nums font-medium text-foreground">{row.weight}kg</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function LiftCard({ lift, records, isSelected, onSelect }: LiftCardProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [newWeight, setNewWeight] = useState('');
    const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

    const addRecord = useAddPersonalRecord();

    // Compute current PR (best 1RM) and previous PR (second best 1RM)
    const oneRepRecords = records.filter((r) => r.reps === 1);
    const sorted = [...oneRepRecords].sort((a, b) => b.weight - a.weight);
    const currentPR = sorted[0] ?? null;
    const previousPR = sorted[1] ?? null;
    const improvement = currentPR && previousPR ? currentPR.weight - previousPR.weight : null;

    function handleSubmit() {
        const weight = parseFloat(newWeight);
        if (isNaN(weight) || weight <= 0) return;

        addRecord.mutate(
            {
                liftId: lift.id,
                weight,
                reps: 1,
                date: newDate,
            },
            {
                onSuccess: () => {
                    toast.success('PR added!');
                    setNewWeight('');
                    setNewDate(new Date().toISOString().split('T')[0]);
                    setIsAdding(false);
                },
                onError: () => {
                    toast.error('Failed to add record.');
                },
            }
        );
    }

    function handleCancel() {
        setIsAdding(false);
        setNewWeight('');
        setNewDate(new Date().toISOString().split('T')[0]);
    }

    return (
        <Card
            className={cn(
                'group relative cursor-pointer gap-0 overflow-hidden border py-0 transition-all duration-200 hover:border-border/80 hover:bg-card/80',
                isSelected ? 'border-primary/50 bg-primary/[0.03] ring-1 ring-primary/20' : 'border-border/50'
            )}
            onClick={() => !isAdding && !isFlipped && onSelect()}
            role="button"
            tabIndex={0}
            aria-selected={isSelected}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !isAdding && !isFlipped) onSelect();
            }}
        >
            {/* Top section */}
            <div className="flex items-start justify-between p-4 pb-0">
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-sm font-semibold text-foreground">{lift.name}</h3>
                    <span
                        className={cn(
                            'inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                            categoryColors[lift.category] ?? 'bg-secondary text-muted-foreground border-border'
                        )}
                    >
                        {categoryLabels[lift.category] ?? lift.category}
                    </span>
                </div>

                {!isAdding && !isFlipped && (
                    <div className="flex items-center gap-1">
                        {currentPR && (
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="size-7 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsFlipped(true);
                                }}
                                aria-label={`Show percentages for ${lift.name}`}
                            >
                                <Percent className="size-3.5" />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="size-7 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsAdding(true);
                            }}
                            aria-label={`Add PR for ${lift.name}`}
                        >
                            <Plus className="size-3.5" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Content area */}
            <div className="p-4 pt-3">
                {isFlipped && currentPR ? (
                    <LiftCardPercentageTable max={currentPR.weight} onBack={() => setIsFlipped(false)} />
                ) : isAdding ? (
                    <LiftCardAddForm
                        newWeight={newWeight}
                        newDate={newDate}
                        isPending={addRecord.isPending}
                        onWeightChange={setNewWeight}
                        onDateChange={setNewDate}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                ) : (
                    <LiftCardPRDisplay currentPR={currentPR} improvement={improvement} />
                )}
            </div>

            {/* Selected indicator line */}
            {isSelected && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
        </Card>
    );
}
