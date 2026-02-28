import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { WizardDay, ProgramBlock, WeekBlocks } from './ProgramWizard';

interface StepReviewProps {
    name: string;
    description: string;
    days: WizardDay[];
    weekBlocks: WeekBlocks[];
}

function BlockReviewCard({ block }: { block: ProgramBlock }) {
    const intensityParts: string[] = [];
    if (block.upTo) {
        if (block.upToPercent) intensityParts.push(`${block.upToPercent}%`);
        if (block.upToRpe) intensityParts.push(`RPE ${block.upToRpe}`);
    }

    return (
        <div className="overflow-hidden rounded-lg border border-border/60 bg-secondary/20">
            {/* Block header */}
            <div className="flex items-center gap-2.5 bg-secondary/30 px-3 py-2">
                <div className="flex size-6 shrink-0 items-center justify-center rounded bg-primary/15 font-mono text-xs font-bold text-primary">
                    {block.label}
                </div>
                <span className="font-mono text-xs font-semibold text-foreground">
                    {block.sets}x{parseInt(block.reps) > 1 ? block.reps : ''}
                </span>
                {intensityParts.length > 0 && (
                    <>
                        <div className="h-3 w-px bg-border" />
                        <span className="text-[11px] text-primary">
                            {'up to '}
                            <span className="font-mono font-semibold">{intensityParts.join(' / ')}</span>
                        </span>
                    </>
                )}
                {block.notes && (
                    <>
                        <div className="h-3 w-px bg-border" />
                        <span className="text-[11px] text-muted-foreground italic">{block.notes}</span>
                    </>
                )}
            </div>

            {/* Movements */}
            <div className="divide-y divide-border/20 px-3">
                {block.movements.map((m) => (
                    <div key={m.id} className="flex items-center gap-2 py-2">
                        <span className="w-6 shrink-0 text-right font-mono text-xs font-semibold text-foreground">
                            {m.reps}
                        </span>
                        <span className="text-sm text-foreground">{m.name}</span>
                    </div>
                ))}
                {block.movements.length === 0 && <p className="py-2 text-xs text-muted-foreground">No movements</p>}
            </div>
        </div>
    );
}

function DayReviewCard({ day, dayBlocks }: { day: WizardDay; dayBlocks: { dayId: string; blocks: ProgramBlock[] }[] }) {
    const dayData = dayBlocks.find((d) => d.dayId === day.id);
    const blocks = dayData?.blocks ?? [];

    return (
        <Card className="border-border bg-card">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground">{day.name}</CardTitle>
            </CardHeader>
            <CardContent>
                {blocks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No exercises</p>
                ) : (
                    <div className="space-y-2">
                        {blocks.map((block) => (
                            <BlockReviewCard key={block.id} block={block} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export function StepReview({ name, description, days, weekBlocks }: StepReviewProps) {
    const isSingleWeek = weekBlocks.length <= 1;

    return (
        <div className="mx-auto w-full max-w-2xl space-y-6">
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
                /* Single week: flat day list */
                <div className="space-y-3">
                    {days.map((day) => (
                        <DayReviewCard key={day.id} day={day} dayBlocks={weekBlocks[0]?.dayBlocks ?? []} />
                    ))}
                </div>
            ) : (
                /* Multi-week: sections per week */
                <div className="space-y-6">
                    {weekBlocks.map((wb) => (
                        <div key={wb.weekNumber}>
                            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                Week {wb.weekNumber}
                            </h3>
                            <div className="space-y-3">
                                {days.map((day) => (
                                    <DayReviewCard key={day.id} day={day} dayBlocks={wb.dayBlocks} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
