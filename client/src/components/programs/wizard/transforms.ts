import type { WizardDay, WeekBlocks } from './ProgramWizard';
import type { CreateProgramData, ProgramResponse, ProgramDraft } from '@liftarchives/shared';

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
                setDetails: (b.setDetails ?? []).map((sd) => ({
                    percent: sd.percent != null ? String(sd.percent) : '',
                    rpe: sd.rpe != null ? String(sd.rpe) : '',
                })),
                notes: b.notes ?? '',
                warning: '',
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
 * Converts an AI-extracted ProgramDraft → wizard state.
 * Requires a lift map (id → name) to populate movement display names.
 */
export function programDraftToWizardData(
    draft: ProgramDraft,
    liftMap: Map<string, string>
): {
    days: WizardDay[];
    weekBlocks: WeekBlocks[];
} {
    // Use first week / first day to derive the canonical day list
    const firstWeek = draft.weeks[0];
    const days: WizardDay[] = (firstWeek?.days ?? []).map((d, i) => ({
        id: crypto.randomUUID(),
        name: d.name || `Day ${i + 1}`,
    }));

    const weekBlocks: WeekBlocks[] = draft.weeks.map((week, wi) => ({
        weekNumber: wi + 1,
        dayBlocks: (week.days ?? []).map((d, di) => ({
            dayId: days[di]?.id ?? crypto.randomUUID(),
            blocks: d.blocks.map((b, bi) => ({
                id: crypto.randomUUID(),
                label: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[bi] ?? `${bi + 1}`,
                sets: String(b.sets),
                reps: String(b.reps),
                movements: b.movements.map((m) => ({
                    id: crypto.randomUUID(),
                    liftId: m.liftId,
                    name: liftMap.get(m.liftId) ?? 'Unknown lift',
                    reps: String(m.reps),
                })),
                upTo: b.upTo,
                upToPercent: b.upToPercent != null ? String(b.upToPercent) : '',
                upToRpe: b.upToRpe != null ? String(b.upToRpe) : '',
                setDetails: (b.setDetails ?? []).map((sd) => ({
                    percent: sd.percent != null ? String(sd.percent) : '',
                    rpe: sd.rpe != null ? String(sd.rpe) : '',
                })),
                notes: b.notes ?? '',
                warning: b.warning ?? '',
            })),
        })),
    }));

    return { days, weekBlocks };
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
                    blocks: (db?.blocks ?? []).map((b) => {
                        const setDetails = b.setDetails
                            .map((sd) => ({
                                percent: sd.percent ? Number(sd.percent) : undefined,
                                rpe: sd.rpe ? Number(sd.rpe) : undefined,
                            }))
                            .filter((sd) => sd.percent !== undefined || sd.rpe !== undefined);

                        return {
                            sets: parseInt(b.sets) || 1,
                            reps: parseInt(b.reps) || 1,
                            movements: b.movements.map((m) => ({
                                liftId: m.liftId,
                                reps: parseInt(m.reps) || 1,
                            })),
                            upTo: b.upTo,
                            upToPercent: b.upToPercent ? Number(b.upToPercent) : undefined,
                            upToRpe: b.upToRpe ? Number(b.upToRpe) : undefined,
                            setDetails: setDetails.length > 0 ? setDetails : undefined,
                            notes: b.notes || undefined,
                        };
                    }),
                };
            }),
        })),
    };
}
