import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { WizardStepper } from './WizardStepper';
import { StepInfo } from './StepInfo';
import { StepDays } from './StepDays';
import { StepExercises } from './StepExercises';
import { StepReview } from './StepReview';
import { wizardDataToPayload } from './transforms';
import { useCreateProgram, useUpdateProgram } from '@/hooks/use-programs';

export interface BlockMovement {
    id: string;
    liftId: string;
    name: string;
    reps: string;
}

export interface ProgramBlock {
    id: string;
    label: string;
    sets: string;
    reps: string;
    movements: BlockMovement[];
    upTo: boolean;
    upToPercent: string;
    upToRpe: string;
    notes: string;
}

export interface DayBlocks {
    dayId: string;
    blocks: ProgramBlock[];
}

export interface WeekBlocks {
    weekNumber: number;
    dayBlocks: DayBlocks[];
}

export interface WizardDay {
    id: string;
    name: string;
}

interface ProgramWizardProps {
    onClose: () => void;
    initialData?: {
        id: string;
        name: string;
        description: string;
        days: WizardDay[];
        weekBlocks: WeekBlocks[];
    };
}

function makeEmptyDayBlocks(days: WizardDay[]): DayBlocks[] {
    return days.map((d) => ({ dayId: d.id, blocks: [] }));
}

export function ProgramWizard({ onClose, initialData }: ProgramWizardProps) {
    const [step, setStep] = useState(0);
    const [name, setName] = useState(initialData?.name ?? '');
    const [description, setDescription] = useState(initialData?.description ?? '');
    const [days, setDays] = useState<WizardDay[]>(
        initialData?.days ?? [
            {
                id: crypto.randomUUID(),
                name: 'Day 1',
            },
        ]
    );
    const [weekBlocks, setWeekBlocks] = useState<WeekBlocks[]>(
        initialData?.weekBlocks ?? [
            {
                weekNumber: 1,
                dayBlocks: [{ dayId: days[0].id, blocks: [] }],
            },
        ]
    );

    const durationWeeks = weekBlocks.length;

    const isEdit = !!initialData;
    const createProgram = useCreateProgram();
    const updateProgram = useUpdateProgram(initialData?.id ?? '');
    const isSaving = createProgram.isPending || updateProgram.isPending;

    const canNext = () => {
        if (step === 0) return name.trim().length > 0;
        if (step === 1) return days.length > 0;
        if (step === 2) return true;
        return true;
    };

    // When duration changes in StepInfo, sync weekBlocks
    const handleDurationWeeksChange = (newDuration: number) => {
        setWeekBlocks((prev) => {
            if (newDuration > prev.length) {
                // Add new weeks with empty dayBlocks for each existing day
                const added: WeekBlocks[] = [];
                for (let i = prev.length; i < newDuration; i++) {
                    added.push({
                        weekNumber: i + 1,
                        dayBlocks: makeEmptyDayBlocks(days),
                    });
                }
                return [...prev, ...added];
            } else if (newDuration < prev.length) {
                // Truncate from the end
                return prev.slice(0, newDuration);
            }
            return prev;
        });
    };

    // StepDays operates on week 1's dayBlocks. We detect adds/removes/duplicates
    // and propagate to other weeks.
    const week1DayBlocks = weekBlocks[0]?.dayBlocks ?? [];

    const handleDayBlocksChange = (newDayBlocks: DayBlocks[]) => {
        const prevDayIds = new Set(week1DayBlocks.map((d) => d.dayId));
        const newDayIds = new Set(newDayBlocks.map((d) => d.dayId));

        // Find added dayIds
        const addedIds = newDayBlocks.filter((d) => !prevDayIds.has(d.dayId));
        // Find removed dayIds
        const removedIds = [...prevDayIds].filter((id) => !newDayIds.has(id));

        setWeekBlocks((prev) =>
            prev.map((wb, idx) => {
                if (idx === 0) {
                    // Week 1 gets the new dayBlocks directly
                    return { ...wb, dayBlocks: newDayBlocks };
                }
                let updated = wb.dayBlocks;

                // Remove deleted days from other weeks
                if (removedIds.length > 0) {
                    updated = updated.filter((d) => !removedIds.includes(d.dayId));
                }

                // Add new days to other weeks (empty blocks for non-week-1)
                if (addedIds.length > 0) {
                    const toAdd = addedIds.map((added) => ({
                        dayId: added.dayId,
                        blocks: added.blocks.map((b) => ({
                            ...b,
                            id: crypto.randomUUID(),
                            movements: b.movements.map((m) => ({ ...m, id: crypto.randomUUID() })),
                        })),
                    }));
                    updated = [...updated, ...toAdd];
                }

                return { ...wb, dayBlocks: updated };
            })
        );
    };

    const handleSave = async () => {
        const payload = wizardDataToPayload(name, description, days, weekBlocks);

        if (isEdit) {
            await updateProgram.mutateAsync(payload);
        } else {
            await createProgram.mutateAsync(payload);
        }
        onClose();
    };

    return (
        <div className="flex flex-col gap-6">
            <WizardStepper currentStep={step} />

            <div className="min-h-75]">
                {step === 0 && (
                    <StepInfo
                        name={name}
                        description={description}
                        durationWeeks={durationWeeks}
                        onNameChange={setName}
                        onDescriptionChange={setDescription}
                        onDurationWeeksChange={handleDurationWeeksChange}
                    />
                )}
                {step === 1 && (
                    <StepDays
                        days={days}
                        onDaysChange={setDays}
                        dayBlocks={week1DayBlocks}
                        onDayBlocksChange={handleDayBlocksChange}
                    />
                )}
                {step === 2 && <StepExercises days={days} weekBlocks={weekBlocks} onWeekBlocksChange={setWeekBlocks} />}
                {step === 3 && <StepReview name={name} description={description} days={days} weekBlocks={weekBlocks} />}
            </div>

            <div className="flex items-center justify-between border-t border-border/40 pt-4">
                <Button
                    variant="ghost"
                    onClick={() => (step === 0 ? onClose() : setStep(step - 1))}
                    disabled={isSaving}
                >
                    {step === 0 ? 'Cancel' : 'Back'}
                </Button>

                {step < 3 ? (
                    <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
                        Next
                    </Button>
                ) : (
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="size-4 animate-spin" />}
                        {isEdit ? 'Update Program' : 'Create Program'}
                    </Button>
                )}
            </div>
        </div>
    );
}
