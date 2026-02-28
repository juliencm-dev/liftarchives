import { useState } from 'react';
import { Calculator, Minus, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { roundToPlate, calcPercentage, calcEpley, calcBrzycki, generatePercentageTable } from '@/lib/calculator';

function PercentageTable({ max, unit }: { max: number; unit: 'kg' | 'lb' }) {
    const rows = generatePercentageTable(max, unit);
    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {rows.map((row) => (
                <div
                    key={row.percent}
                    className="flex items-center justify-between rounded px-2 py-1 odd:bg-secondary/50"
                >
                    <span className="tabular-nums text-muted-foreground">{row.percent}%</span>
                    <span className="tabular-nums font-medium text-foreground">
                        {row.weight}
                        <span className="ml-0.5 text-xs text-muted-foreground">{unit}</span>
                    </span>
                </div>
            ))}
        </div>
    );
}

function CustomSlider({ max, unit }: { max: number; unit: 'kg' | 'lb' }) {
    const [percent, setPercent] = useState(80);

    const weight = roundToPlate(calcPercentage(max, percent), unit);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon-sm"
                    className="size-7 shrink-0"
                    onClick={() => setPercent((p) => Math.max(1, p - 1))}
                    aria-label="Decrease percentage"
                >
                    <Minus className="size-3" />
                </Button>
                <input
                    type="range"
                    min={5}
                    max={100}
                    step={5}
                    value={Math.round(percent / 5) * 5}
                    onChange={(e) => setPercent(Number(e.target.value))}
                    className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
                />
                <Button
                    variant="outline"
                    size="icon-sm"
                    className="size-7 shrink-0"
                    onClick={() => setPercent((p) => Math.min(100, p + 1))}
                    aria-label="Increase percentage"
                >
                    <Plus className="size-3" />
                </Button>
            </div>
            <div className="flex items-center justify-center gap-3 text-sm">
                <span className="tabular-nums font-semibold text-primary">{percent}%</span>
                <span className="text-muted-foreground">&rarr;</span>
                <span className="tabular-nums font-medium text-foreground">
                    {weight}
                    <span className="ml-0.5 text-xs text-muted-foreground">{unit}</span>
                </span>
            </div>
        </div>
    );
}

function RepMaxEstimator({ unit }: { unit: 'kg' | 'lb' }) {
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');

    const w = parseFloat(weight);
    const r = parseInt(reps, 10);
    const hasInput = !isNaN(w) && w > 0 && !isNaN(r) && r > 1 && r < 37;

    const epley = hasInput ? roundToPlate(calcEpley(w, r), unit) : null;
    const brzycki = hasInput ? roundToPlate(calcBrzycki(w, r), unit) : null;

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">Rep Max Estimator</h4>
            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    step="0.5"
                    placeholder="Weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-8 text-sm"
                />
                <span className="text-xs text-muted-foreground">{unit}</span>
                <span className="text-xs text-muted-foreground">&times;</span>
                <Input
                    type="number"
                    min="2"
                    max="36"
                    placeholder="Reps"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="h-8 w-20 text-sm"
                />
                <span className="text-xs text-muted-foreground">reps</span>
            </div>
            {hasInput && (
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-border/60 bg-secondary/30 p-3 text-center">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Epley</p>
                        <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
                            {epley}
                            <span className="ml-0.5 text-xs font-normal text-muted-foreground">{unit}</span>
                        </p>
                    </div>
                    <div className="rounded-lg border border-border/60 bg-secondary/30 p-3 text-center">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            Brzycki
                        </p>
                        <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
                            {brzycki}
                            <span className="ml-0.5 text-xs font-normal text-muted-foreground">{unit}</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export function PercentageCalculatorDialog({
    trigger,
    open,
    onOpenChange,
}: {
    trigger: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const [maxWeight, setMaxWeight] = useState('');
    const unit: 'kg' | 'lb' = 'kg';
    const max = parseFloat(maxWeight);
    const hasMax = !isNaN(max) && max > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calculator className="size-5 text-primary" />
                        Percentage Calculator
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-5">
                    {/* Weight input */}
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            step="0.5"
                            placeholder="Enter 1RM weight"
                            value={maxWeight}
                            onChange={(e) => setMaxWeight(e.target.value)}
                            className="text-sm"
                            autoFocus
                        />
                        <span className="text-sm text-muted-foreground">{unit}</span>
                    </div>

                    {hasMax && (
                        <>
                            {/* Percentage table */}
                            <PercentageTable max={max} unit={unit} />

                            {/* Custom slider */}
                            <div className="rounded-lg border border-border/60 bg-secondary/20 p-3">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Custom Percentage
                                </p>
                                <CustomSlider max={max} unit={unit} />
                            </div>
                        </>
                    )}

                    {/* Separator */}
                    <div className="border-t border-border/50" />

                    {/* Rep max estimator */}
                    <RepMaxEstimator unit={unit} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
