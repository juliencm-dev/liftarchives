import type { WizardDay, WeekBlocks } from './ProgramWizard';
import type { CreateProgramData, ProgramResponse } from '@liftarchives/shared';

/**
 * Converts server program response → wizard state (for edit mode).
 * Iterates all weeks; uses week 1 to derive day names.
 */
export function serverProgramToWizardData(program: ProgramResponse): {
    id: string;
    name: string;
    description: string;
    days: WizardDay[];
    weekBlocks: WeekBlocks[];
} {
    // Use week 1 (or first available) to derive day names
    const firstWeek = program.weeks[0];
    const days: WizardDay[] = [];

    // Build a map from dayNumber → wizardDayId so every week references the same dayIds
    const dayNumberToId = new Map<number, string>();
    for (const d of firstWeek?.days ?? []) {
        const dayId = crypto.randomUUID();
        dayNumberToId.set(d.dayNumber, dayId);
        days.push({ id: dayId, name: d.name || `Day ${d.dayNumber}` });
    }

    // Build weekBlocks for every week
    const weekBlocks: WeekBlocks[] = program.weeks.map((week) => ({
        weekNumber: week.weekNumber,
        dayBlocks: (week.days ?? []).map((d) => ({
            dayId: dayNumberToId.get(d.dayNumber) ?? crypto.randomUUID(),
            blocks: d.blocks.map((b, i) => ({
                id: crypto.randomUUID(),
                label: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i] ?? `${i + 1}`,
                sets: String(b.sets),
                reps: String(b.reps),
                movements: b.movements.map((m) => ({
                    id: crypto.randomUUID(),
                    liftId: m.liftId,
                    name: m.lift.name,
                    reps: String(m.reps),
                })),
                upTo: b.upTo,
                upToPercent: b.upToPercent != null ? String(b.upToPercent) : '',
                upToRpe: b.upToRpe != null ? String(b.upToRpe) : '',
                notes: b.notes ?? '',
            })),
        })),
    }));

    return {
        id: program.id,
        name: program.name,
        description: program.description || '',
        days,
        weekBlocks,
    };
}

/**
 * Converts wizard state → API payload for create/update.
 */
export function wizardDataToPayload(
    name: string,
    description: string,
    days: WizardDay[],
    weekBlocks: WeekBlocks[]
): CreateProgramData {
    return {
        name: name.trim(),
        description: description.trim() || undefined,
        weeks: weekBlocks.map((wb) => ({
            days: days.map((d) => {
                const db = wb.dayBlocks.find((x) => x.dayId === d.id);
                return {
                    name: d.name || undefined,
                    blocks: (db?.blocks ?? []).map((b) => ({
                        sets: parseInt(b.sets) || 1,
                        reps: parseInt(b.reps) || 1,
                        movements: b.movements.map((m) => ({
                            liftId: m.liftId,
                            reps: parseInt(m.reps) || 1,
                        })),
                        upTo: b.upTo,
                        upToPercent: b.upToPercent ? Number(b.upToPercent) : undefined,
                        upToRpe: b.upToRpe ? Number(b.upToRpe) : undefined,
                        notes: b.notes || undefined,
                    })),
                };
            }),
        })),
    };
}
