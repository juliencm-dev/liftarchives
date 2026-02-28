import { ProgramDayCard } from '@/components/programs/ProgramDayCard';
import { DaysCarousel } from '@/components/programs/DaysCarousel';
import type { WizardDay, ProgramBlock, WeekBlocks } from './ProgramWizard';
import type { ProgramDayResponse } from '@liftarchives/shared';

interface StepReviewProps {
    name: string;
    description: string;
    days: WizardDay[];
    weekBlocks: WeekBlocks[];
}

/** Map wizard block data to ProgramDayResponse so we can reuse ProgramDayCard / ExerciseBlock. */
function toDayResponse(
    day: WizardDay,
    dayIndex: number,
    dayBlocks: { dayId: string; blocks: ProgramBlock[] }[]
): ProgramDayResponse {
    const data = dayBlocks.find((d) => d.dayId === day.id);
    const blocks = data?.blocks ?? [];

    return {
        id: day.id,
        dayNumber: dayIndex + 1,
        name: day.name || null,
        notes: null,
        blocks: blocks.map((b, i) => ({
            id: b.id,
            displayOrder: i + 1,
            sets: parseInt(b.sets) || 1,
            reps: parseInt(b.reps) || 1,
            upTo: b.upTo,
            upToPercent: b.upToPercent ? parseFloat(b.upToPercent) : null,
            upToRpe: b.upToRpe ? parseFloat(b.upToRpe) : null,
            notes: b.notes || null,
            movements: b.movements.map((m, mi) => ({
                id: m.id,
                liftId: m.liftId,
                displayOrder: mi + 1,
                reps: parseInt(m.reps) || 1,
                lift: {
                    id: m.liftId,
                    name: m.name,
                    isCore: false,
                    parentLiftId: null,
                    category: 'accessory' as const,
                    description: null,
                },
            })),
        })),
    };
}

export function StepReview({ name, description, days, weekBlocks }: StepReviewProps) {
    const isSingleWeek = weekBlocks.length <= 1;

    const renderDays = (dayBlocks: { dayId: string; blocks: ProgramBlock[] }[]) => {
        const dayResponses = days.map((day, i) => toDayResponse(day, i, dayBlocks));

        return (
            <>
                {/* Mobile: stacked column */}
                <div className="space-y-3 md:hidden">
                    {dayResponses.map((day) => (
                        <ProgramDayCard key={day.id} day={day} defaultOpen />
                    ))}
                </div>
                {/* Desktop: 3-wide carousel */}
                <DaysCarousel>
                    {dayResponses.map((day) => (
                        <ProgramDayCard key={day.id} day={day} defaultOpen />
                    ))}
                </DaysCarousel>
            </>
        );
    };

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            {/* Program summary */}
            <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground">{name || 'Untitled Program'}</h2>
                <p className="text-sm text-muted-foreground">
                    {days.length} {days.length === 1 ? 'day' : 'days'} per week
                    {weekBlocks.length > 1 && ` · ${weekBlocks.length} weeks`}
                </p>
                {description && <p className="mt-2 text-sm text-muted-foreground/80">{description}</p>}
            </div>

            {isSingleWeek ? (
                renderDays(weekBlocks[0]?.dayBlocks ?? [])
            ) : (
                /* Multi-week: sections per week */
                <div className="space-y-6">
                    {weekBlocks.map((wb) => (
                        <div key={wb.weekNumber}>
                            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                Week {wb.weekNumber}
                            </h3>
                            {renderDays(wb.dayBlocks)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
