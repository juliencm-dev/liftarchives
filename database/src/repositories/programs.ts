import { eq, and, asc } from "drizzle-orm";
import {
  programs,
  programWeeks,
  programDays,
  programBlocks,
  programBlockMovements,
  programAssignments,
} from "../schemas";
import type { CreateProgramData } from "@liftarchives/shared";
import type { DbClient } from "./types";

type ProgramAssignmentRow = typeof programAssignments.$inferSelect;

export async function getUserPrograms(dbClient: DbClient, userId: string) {
  return dbClient.query.programs.findMany({
    where: eq(programs.createdById, userId),
    orderBy: asc(programs.createdAt),
    with: {
      weeks: {
        with: {
          days: true,
        },
      },
    },
  });
}

export async function getProgramById(dbClient: DbClient, programId: string) {
  return dbClient.query.programs.findFirst({
    where: eq(programs.id, programId),
    with: {
      weeks: {
        orderBy: asc(programWeeks.weekNumber),
        with: {
          days: {
            orderBy: asc(programDays.dayNumber),
            with: {
              blocks: {
                orderBy: asc(programBlocks.displayOrder),
                with: {
                  movements: {
                    orderBy: asc(programBlockMovements.displayOrder),
                    with: {
                      lift: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

async function insertDayBlocks(
  tx: Parameters<Parameters<DbClient["transaction"]>[0]>[0],
  dayId: string,
  day: CreateProgramData["weeks"][number]["days"][number],
) {
  for (let blockIdx = 0; blockIdx < day.blocks.length; blockIdx++) {
    const block = day.blocks[blockIdx];
    const blockId = crypto.randomUUID();

    await tx.insert(programBlocks).values({
      id: blockId,
      dayId,
      displayOrder: blockIdx + 1,
      sets: block.sets,
      reps: block.reps,
      upTo: block.upTo ?? false,
      upToPercent: block.upToPercent,
      upToRpe: block.upToRpe,
      notes: block.notes,
    });

    for (let movIdx = 0; movIdx < block.movements.length; movIdx++) {
      const movement = block.movements[movIdx];
      await tx.insert(programBlockMovements).values({
        id: crypto.randomUUID(),
        blockId,
        liftId: movement.liftId,
        displayOrder: movIdx + 1,
        reps: movement.reps,
      });
    }
  }
}

export async function createProgram(
  dbClient: DbClient,
  userId: string,
  data: CreateProgramData,
) {
  const newProgramId = crypto.randomUUID();

  await dbClient.transaction(async (tx) => {
    await tx.insert(programs).values({
      id: newProgramId,
      createdById: userId,
      name: data.name,
      description: data.description,
      durationWeeks: data.weeks.length,
    });

    for (let weekIdx = 0; weekIdx < data.weeks.length; weekIdx++) {
      const week = data.weeks[weekIdx];
      const weekId = crypto.randomUUID();
      await tx.insert(programWeeks).values({
        id: weekId,
        programId: newProgramId,
        weekNumber: weekIdx + 1,
        name: week.name,
      });

      for (let i = 0; i < week.days.length; i++) {
        const day = week.days[i];
        const dayId = crypto.randomUUID();
        await tx.insert(programDays).values({
          id: dayId,
          weekId,
          dayNumber: i + 1,
          name: day.name,
        });

        await insertDayBlocks(tx, dayId, day);
      }
    }
  });

  return getProgramById(dbClient, newProgramId);
}

export async function updateProgram(
  dbClient: DbClient,
  userId: string,
  programId: string,
  data: CreateProgramData,
) {
  // Verify ownership first
  const existing = await dbClient.query.programs.findFirst({
    where: and(eq(programs.id, programId), eq(programs.createdById, userId)),
    with: { weeks: true },
  });

  if (!existing) return null;

  await dbClient.transaction(async (tx) => {
    // Update program metadata
    await tx
      .update(programs)
      .set({
        name: data.name,
        description: data.description,
        durationWeeks: data.weeks.length,
      })
      .where(eq(programs.id, programId));

    // Delete existing weeks (cascade deletes days, blocks, movements)
    for (const week of existing.weeks) {
      await tx.delete(programWeeks).where(eq(programWeeks.id, week.id));
    }

    // Re-insert full tree with all weeks
    for (let weekIdx = 0; weekIdx < data.weeks.length; weekIdx++) {
      const week = data.weeks[weekIdx];
      const weekId = crypto.randomUUID();
      await tx.insert(programWeeks).values({
        id: weekId,
        programId,
        weekNumber: weekIdx + 1,
        name: week.name,
      });

      for (let i = 0; i < week.days.length; i++) {
        const day = week.days[i];
        const dayId = crypto.randomUUID();
        await tx.insert(programDays).values({
          id: dayId,
          weekId,
          dayNumber: i + 1,
          name: day.name,
        });

        await insertDayBlocks(tx, dayId, day);
      }
    }
  });

  return getProgramById(dbClient, programId);
}

export async function deleteProgram(
  dbClient: DbClient,
  userId: string,
  programId: string,
) {
  const [result] = await dbClient
    .delete(programs)
    .where(and(eq(programs.id, programId), eq(programs.createdById, userId)))
    .returning();
  return result;
}

export async function getActiveAssignment(
  dbClient: DbClient,
  userId: string,
) {
  return dbClient.query.programAssignments.findFirst({
    where: and(
      eq(programAssignments.userId, userId),
      eq(programAssignments.status, "active"),
    ),
    with: {
      program: {
        with: {
          weeks: {
            orderBy: asc(programWeeks.weekNumber),
            with: {
              days: {
                orderBy: asc(programDays.dayNumber),
                with: {
                  blocks: {
                    orderBy: asc(programBlocks.displayOrder),
                    with: {
                      movements: {
                        orderBy: asc(programBlockMovements.displayOrder),
                        with: {
                          lift: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function assignProgram(
  dbClient: DbClient,
  userId: string,
  programId: string,
  startDate?: string,
) {
  return dbClient.transaction(async (tx) => {
    // Deactivate any existing active assignment
    const existing = await tx.query.programAssignments.findFirst({
      where: and(
        eq(programAssignments.userId, userId),
        eq(programAssignments.status, "active"),
      ),
    });

    if (existing) {
      await tx
        .update(programAssignments)
        .set({ status: "completed" })
        .where(eq(programAssignments.id, existing.id));
    }

    // Delete any existing assignment for this specific program+user combo
    await tx
      .delete(programAssignments)
      .where(
        and(
          eq(programAssignments.userId, userId),
          eq(programAssignments.programId, programId),
        ),
      );

    const [assignment] = await tx
      .insert(programAssignments)
      .values({
        id: crypto.randomUUID(),
        programId,
        userId,
        startDate: startDate || null,
        status: "active",
        currentWeekNumber: 1,
        currentCycle: 1,
        currentWeekStartedAt: new Date(),
      })
      .returning();

    return assignment;
  });
}

export async function advanceWeekIfComplete(
  dbClient: DbClient,
  assignment: ProgramAssignmentRow & {
    program: {
      durationWeeks: number;
      weeks: { weekNumber: number; days: { id: string }[] }[];
    };
  },
  completedDayIds: string[],
): Promise<{
  advanced: boolean;
  newWeekNumber?: number;
  newCycle?: number;
}> {
  // Find the current week by weekNumber
  const week = assignment.program.weeks.find(
    (w) => w.weekNumber === assignment.currentWeekNumber,
  );
  if (!week) return { advanced: false };

  const weekDayIds = week.days.map((d) => d.id);
  const allComplete = weekDayIds.every((id) => completedDayIds.includes(id));

  if (!allComplete) return { advanced: false };

  let newWeekNumber: number;
  let newCycle: number;

  if (assignment.currentWeekNumber < assignment.program.durationWeeks) {
    newWeekNumber = assignment.currentWeekNumber + 1;
    newCycle = assignment.currentCycle;
  } else {
    newWeekNumber = 1;
    newCycle = assignment.currentCycle + 1;
  }

  await dbClient
    .update(programAssignments)
    .set({
      currentWeekNumber: newWeekNumber,
      currentCycle: newCycle,
      currentWeekStartedAt: new Date(),
    })
    .where(eq(programAssignments.id, assignment.id));

  return { advanced: true, newWeekNumber, newCycle };
}

export async function unassignProgram(
  dbClient: DbClient,
  userId: string,
  programId: string,
) {
  const [result] = await dbClient
    .update(programAssignments)
    .set({ status: "completed" })
    .where(
      and(
        eq(programAssignments.userId, userId),
        eq(programAssignments.programId, programId),
        eq(programAssignments.status, "active"),
      ),
    )
    .returning();
  return result;
}
